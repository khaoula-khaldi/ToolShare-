const Magasin = require("../models/Magasin");

const PUBLIC_FIELDS = 'nom adresse actif gestionnaireId';

const creer = async (data) => {
    return await Magasin.create(data);
};

const trouverTous = async () => {
    return await Magasin.find();
};

const trouverParId = async (id) => {
    return await Magasin.findById(id);
};

const modifierParId = async (id, data) => {
    return await Magasin.findByIdAndUpdate(id, data, {
        returnDocument: 'after',
        runValidators: true
    });
};

const supprimerParId = async (id) => {
    return await Magasin.findByIdAndDelete(id);
};

const disactiveMagasin = async (id) => {
    return await Magasin.findByIdAndUpdate(
        id,
        { actif: false },
        { returnDocument: 'after', runValidators: true }
    );
};

const findByGestionnaire = async (userId) => {
    return await Magasin.findOne({ gestionnaireId: userId }).select(PUBLIC_FIELDS);
};

const findByGestionnaires = async (userIds = []) => {
    if (!userIds.length) return [];
    return await Magasin.find({ gestionnaireId: { $in: userIds } }).select(PUBLIC_FIELDS);
};

const assignGestionnaire = async (magasinId, userId) => {
    return await Magasin.findOneAndUpdate(
        { _id: magasinId, actif: true, gestionnaireId: { $in: [null, userId] } },
        { gestionnaireId: userId },
        { returnDocument: 'after', runValidators: true }
    ).select(PUBLIC_FIELDS);
};

const unassignGestionnaire = async (userId, exceptMagasinId = null) => {
    const filter = { gestionnaireId: userId };
    if (exceptMagasinId) filter._id = { $ne: exceptMagasinId };
    return await Magasin.updateMany(filter, { gestionnaireId: null });
};

module.exports = {
    creer,
    trouverTous,
    trouverParId,
    modifierParId,
    supprimerParId,
    disactiveMagasin,
    findByGestionnaire,
    findByGestionnaires,
    assignGestionnaire,
    unassignGestionnaire,
};