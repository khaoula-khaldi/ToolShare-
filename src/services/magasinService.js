
const magasinRepository = require("../repositories/magasinRepository");

const creerMagasin = async (data) => {
    if (!data.nom || !data.adresse) {
        throw new Error("Le nom et l'adresse sont obligatoires.");
    }

    return await magasinRepository.creer(data);
};

const obtenirTousLesMagasins = async () => {
    return await magasinRepository.trouverTous();
};

const obtenirMagasinParId = async (id) => {
    const magasin = await magasinRepository.trouverParId(id);

    if (!magasin) {
        throw new Error("Magasin introuvable.");
    }

    return magasin;
};

const modifierMagasin = async (id, data) => {
    if (!data.nom && !data.adresse) {
        throw new Error("Au moins un champ est obligatoire pour la modification.");
    }

    const magasin = await magasinRepository.modifierParId(id, data);

    if (!magasin) {
        throw new Error("Magasin introuvable.");
    }

    return magasin;
};

const supprimerMagasin = async (id) => {
    const magasin = await magasinRepository.supprimerParId(id);

    if (!magasin) {
        throw new Error("Magasin introuvable.");
    }

    return magasin;
};

module.exports = {
    creerMagasin,
    obtenirTousLesMagasins,
    obtenirMagasinParId,
    modifierMagasin,
    supprimerMagasin
};
