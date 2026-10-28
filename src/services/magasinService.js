const mongoose = require("mongoose");
const magasinRepository = require("../repositories/magasinRepository");
const AppError = require("../utils/AppError");

const assertObjectId = (id) => {
    if (!mongoose.isValidObjectId(id)) throw new AppError("Id du magasin invalide.", 400);
};

const isFilled = (value) => typeof value === "string" && value.trim() !== "";

const pickEditableFields = (data = {}) => {
    const fields = {};
    if (data.nom !== undefined) fields.nom = data.nom;
    if (data.adresse !== undefined) fields.adresse = data.adresse;
    return fields;
};

const creerMagasin = async (data = {}) => {
    if (!isFilled(data.nom) || !isFilled(data.adresse)) {
        throw new AppError("Le nom et l'adresse sont obligatoires.", 400);
    }

    return await magasinRepository.creer({ nom: data.nom, adresse: data.adresse });
};

const obtenirTousLesMagasins = async () => {
    return await magasinRepository.trouverTous();
};

const obtenirMagasinParId = async (id) => {
    assertObjectId(id);
    const magasin = await magasinRepository.trouverParId(id);

    if (!magasin) {
        throw new AppError("Magasin introuvable.", 404);
    }

    return magasin;
};

const modifierMagasin = async (id, data = {}) => {
    assertObjectId(id);
    const fields = pickEditableFields(data);

    if (!Object.keys(fields).length) {
        throw new AppError("Au moins un champ (nom, adresse) est obligatoire pour la modification.", 400);
    }
    if (Object.values(fields).some((value) => !isFilled(value))) {
        throw new AppError("Le nom et l'adresse ne peuvent pas être vides.", 400);
    }

    const magasin = await magasinRepository.modifierParId(id, fields);

    if (!magasin) {
        throw new AppError("Magasin introuvable.", 404);
    }

    return magasin;
};

const supprimerMagasin = async (id) => {
    assertObjectId(id);
    const magasin = await magasinRepository.supprimerParId(id);

    if (!magasin) {
        throw new AppError("Magasin introuvable.", 404);
    }

    return magasin;
};

const disactiveMagasinbyId = async (id) => {
    const magasin = await obtenirMagasinParId(id);

    if (!magasin.actif) {
        throw new AppError("Magasin déjà désactivé.", 400);
    }

    return await magasinRepository.disactiveMagasin(id);
};

module.exports = {
    creerMagasin,
    obtenirTousLesMagasins,
    obtenirMagasinParId,
    modifierMagasin,
    supprimerMagasin,
    disactiveMagasinbyId,
};