const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userRepo = require('../repositories/user.repo');
const magasinRepo = require('../repositories/magasinRepository');
const AppError = require('../utils/AppError');

const ROLES = ['admin', 'gestionnaire', 'user'];

const PERMISSIONS = {
    admin: ['admin', 'gestionnaire', 'user'],
    gestionnaire: ['user'],
    user: [],
};

const canManage = (actor, targetRole) => (PERMISSIONS[actor.role] || []).includes(targetRole);

const isSelf = (actor, id) => String(actor.id) === String(id);

const idOf = (doc) => doc._id ?? doc.id;

const toPlain = (doc) => (doc && typeof doc.toJSON === 'function' ? doc.toJSON() : doc);

const assertObjectId = (id, label = 'id') => {
    if (!mongoose.isValidObjectId(id)) throw new AppError(`${label} invalide`, 400);
};

const normalizeEmail = (email) => (typeof email === 'string' ? email.trim().toLowerCase() : email);

const validatePassword = (password) => {
    if (typeof password !== 'string' || password.length < 6) {
        throw new AppError('Le mot de passe doit contenir au moins 6 caractères', 400);
    }
};

// ---------- AFFECTATION (Magasin.gestionnaireId) ----------

// Check 9bel ma nbdlo walo: magasin kayn, actif, w ma fihch gestionnaire akhor
const ensureActiveMagasin = async (magasinId, userId = null) => {
    if (!magasinId) throw new AppError('Un gestionnaire doit être affecté à un magasin', 400);
    assertObjectId(magasinId, 'magasin');

    const magasin = await magasinRepo.trouverParId(magasinId);
    if (!magasin) throw new AppError('Magasin introuvable', 404);
    if (!magasin.actif) throw new AppError('Magasin désactivé', 400);
    if (magasin.gestionnaireId && String(magasin.gestionnaireId) !== String(userId)) {
        throw new AppError('Ce magasin a déjà un gestionnaire', 409);
    }
    return magasin;
};

const assignMagasin = async (userId, magasinId) => {
    const magasin = await magasinRepo.assignGestionnaire(magasinId, userId);
    if (!magasin) throw new AppError('Ce magasin a déjà un gestionnaire', 409);
    await magasinRepo.unassignGestionnaire(userId, magasinId);
    return magasin;
};

const withMagasin = async (user) => {
    const plain = toPlain(user);
    if (plain.role !== 'gestionnaire') return plain;
    const magasin = await magasinRepo.findByGestionnaire(idOf(user));
    return { ...plain, magasin: toPlain(magasin) ?? null };
};

const createUser = async (actor, data) => {
    const { name, password, magasin } = data;
    const email = normalizeEmail(data.email);
    const role = data.role || 'user';

    if (!name || !email || !password) throw new AppError('name, email et password sont obligatoires', 400);
    if (!ROLES.includes(role)) throw new AppError('Rôle invalide', 400);
    if (!canManage(actor, role)) throw new AppError(`Vous ne pouvez pas créer un compte ${role}`, 403);
    validatePassword(password);

    if (await userRepo.findByEmail(email)) throw new AppError('Email déjà utilisé', 409);

    if (role === 'gestionnaire') await ensureActiveMagasin(magasin);

    const hashed = await bcrypt.hash(password, 10);
    const user = await userRepo.create({ name, email, password: hashed, role });

    if (role !== 'gestionnaire') return toPlain(user);

    try {
        const assigned = await assignMagasin(idOf(user), magasin);
        return { ...toPlain(user), magasin: toPlain(assigned) };
    } catch (err) {
        await userRepo.deleteById(idOf(user));
        throw err;
    }
};

const getUsers = async (actor, query = {}) => {
    const allowedRoles = PERMISSIONS[actor.role] || [];
    const filter = {};

    if (query.role) {
        if (!allowedRoles.includes(query.role)) throw new AppError('Accès refusé à ce rôle', 403);
        filter.role = query.role;
    } else {
        filter.role = { $in: allowedRoles };
    }

    if (query.status === 'true' || query.status === 'false') filter.status = query.status === 'true';

    if (query.search) {
        const regex = new RegExp(String(query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        filter.$or = [{ name: regex }, { email: regex }];
    }

    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);

    const [users, total] = await Promise.all([
        userRepo.findAll(filter, { skip: (page - 1) * limit, limit }),
        userRepo.count(filter),
    ]);

    const gestionnaireIds = users.filter((u) => u.role === 'gestionnaire').map(idOf);
    const magasins = gestionnaireIds.length ? await magasinRepo.findByGestionnaires(gestionnaireIds) : [];
    const byGestionnaire = new Map(magasins.map((m) => [String(m.gestionnaireId), toPlain(m)]));

    const data = users.map((u) => {
        const plain = toPlain(u);
        return u.role === 'gestionnaire' ? { ...plain, magasin: byGestionnaire.get(String(idOf(u))) ?? null } : plain;
    });

    return { data, total, page, limit, pages: Math.ceil(total / limit) };
};

const findManageableUser = async (actor, id) => {
    assertObjectId(id);
    const user = await userRepo.findById(id);
    if (!user) throw new AppError('Utilisateur introuvable', 404);
    if (!canManage(actor, user.role)) throw new AppError('Accès refusé', 403);
    return user;
};

const getUserById = async (actor, id) => withMagasin(await findManageableUser(actor, id));

const updateUser = async (actor, id, data) => {
    const user = await findManageableUser(actor, id);
    const updates = {};

    if (data.name !== undefined) updates.name = data.name;

    if (data.email !== undefined) {
        const email = normalizeEmail(data.email);
        const existing = await userRepo.findByEmail(email);
        if (existing && String(idOf(existing)) !== String(id)) throw new AppError('Email déjà utilisé', 409);
        updates.email = email;
    }

    if (data.password !== undefined) {
        validatePassword(data.password);
        updates.password = await bcrypt.hash(data.password, 10);
    }

    const newRole = data.role ?? user.role;
    if (!ROLES.includes(newRole)) throw new AppError('Rôle invalide', 400);
    if (!canManage(actor, newRole)) throw new AppError(`Vous ne pouvez pas attribuer le rôle ${newRole}`, 403);
    if (isSelf(actor, id) && newRole !== user.role) {
        throw new AppError('Vous ne pouvez pas modifier votre propre rôle', 400);
    }
    updates.role = newRole;

    let targetMagasin = null;
    if (newRole === 'gestionnaire') {
        if (data.magasin !== undefined) {
            await ensureActiveMagasin(data.magasin, id);
            targetMagasin = data.magasin;
        } else if (!(await magasinRepo.findByGestionnaire(id))) {
            throw new AppError('Un gestionnaire doit être affecté à un magasin', 400);
        }
    }

    const updated = await userRepo.updateById(id, updates);

    if (targetMagasin) {
        await assignMagasin(id, targetMagasin);
    } else if (newRole !== 'gestionnaire' && user.role === 'gestionnaire') {
        await magasinRepo.unassignGestionnaire(id);
    }

    return withMagasin(updated);
};

const setUserStatus = async (actor, id, status) => {
    if (typeof status !== 'boolean') throw new AppError('status doit être un booléen', 400);
    await findManageableUser(actor, id);
    if (isSelf(actor, id) && status === false) throw new AppError('Vous ne pouvez pas désactiver votre propre compte', 400);
    return withMagasin(await userRepo.updateById(id, { status }));
};

const affecterMagasin = async (actor, id, magasinId) => {
    const user = await findManageableUser(actor, id);
    if (user.role !== 'gestionnaire') throw new AppError("Seul un gestionnaire peut être affecté à un magasin", 400);

    await ensureActiveMagasin(magasinId, id);
    await assignMagasin(id, magasinId);
    return withMagasin(user);
};

const getMonMagasin = async (actor) => {
    const magasin = await magasinRepo.findByGestionnaire(actor.id);
    if (!magasin) throw new AppError('Aucun magasin affecté à ce gestionnaire', 404);
    return magasin;
};



module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    setUserStatus,
    affecterMagasin,
    getMonMagasin,
    PERMISSIONS,
};