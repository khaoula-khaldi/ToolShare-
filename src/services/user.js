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

const assertObjectId = (id, label = 'id') => {
    if (!mongoose.isValidObjectId(id)) throw new AppError(`${label} invalide`, 400);
};

const ensureActiveMagasin = async (magasinId) => {
    if (!magasinId) throw new AppError('Un gestionnaire doit être affecté à un magasin', 400);
    assertObjectId(magasinId, 'magasin');
    const magasin = await magasinRepo.trouverParId(magasinId);
    if (!magasin) throw new AppError('Magasin introuvable', 404);
    if (!magasin.status) throw new AppError('Magasin désactivé', 400);
};

const normalizeEmail = (email) => (typeof email === 'string' ? email.trim().toLowerCase() : email);

const validatePassword = (password) => {
    if (typeof password !== 'string' || password.length < 6) {
        throw new AppError('Le mot de passe doit contenir au moins 6 caractères', 400);
    }
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

    return userRepo.create({
        name,
        email,
        password: hashed,
        role,
        magasin: role === 'gestionnaire' ? magasin : null,
    });
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

    if (query.magasin) {
        assertObjectId(query.magasin, 'magasin');
        filter.magasin = query.magasin;
    }

    if (query.search) {
        const regex = new RegExp(query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        filter.$or = [{ name: regex }, { email: regex }];
    }

    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);

    const [data, total] = await Promise.all([
        userRepo.findAll(filter, { skip: (page - 1) * limit, limit }),
        userRepo.count(filter),
    ]);

    return { data, total, page, limit, pages: Math.ceil(total / limit) };
};

const getUserById = async (actor, id) => {
    assertObjectId(id);
    const user = await userRepo.findById(id);
    if (!user) throw new AppError('Utilisateur introuvable', 404);
    if (!canManage(actor, user.role)) throw new AppError('Accès refusé', 403);
    return user;
};

const updateUser = async (actor, id, data) => {
    const user = await getUserById(actor, id);
    const updates = {};

    if (data.name !== undefined) updates.name = data.name;

    if (data.email !== undefined) {
        const email = normalizeEmail(data.email);
        const existing = await userRepo.findByEmail(email);
        if (existing && String(existing._id) !== String(id)) throw new AppError('Email déjà utilisé', 409);
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

    if (newRole === 'gestionnaire') {
        const magasinId = data.magasin ?? user.magasin?._id ?? user.magasin;
        await ensureActiveMagasin(magasinId);
        updates.magasin = magasinId;
    } else {
        updates.magasin = null;
    }

    return userRepo.updateById(id, updates);
};

const setUserStatus = async (actor, id, status) => {
    if (typeof status !== 'boolean') throw new AppError('status doit être un booléen', 400);
    await getUserById(actor, id);
    if (isSelf(actor, id) && status === false) throw new AppError('Vous ne pouvez pas désactiver votre propre compte', 400);
    return userRepo.updateById(id, { status });
};

module.exports = { createUser, getUsers, getUserById, updateUser, setUserStatus, PERMISSIONS };
