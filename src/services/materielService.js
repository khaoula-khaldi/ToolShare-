
const materielRepository = require("../repositories/materielRepository");

const creerMateriel = async (data) => {
    if (!data.nom || !data.magasinId) {
        throw new Error("Le nom et le magasin sont obligatoires.");
    }

    return await materielRepository.creer(data);
};

const obtenirTousLesMateriels = async (filtres = {}) => {
    return await materielRepository.trouverTous(filtres);
};

const obtenirMaterielParId = async (id) => {
    const materiel = await materielRepository.trouverParId(id);

    if (!materiel) {
        throw new Error("Matériel introuvable.");
    }

    return materiel;
};

const modifierMateriel = async (id, data) => {
    const materiel = await materielRepository.modifierParId(id, data);

    if (!materiel) {
        throw new Error("Matériel introuvable.");
    }

    return materiel;
};

const desactiverMateriel = async (id) => {
    const materiel = await materielRepository.modifierParId(id, {
        actif: false
    });

    if (!materiel) {
        throw new Error("Matériel introuvable.");
    }

    return materiel;
};

module.exports = {
    creerMateriel,
    obtenirTousLesMateriels,
    obtenirMaterielParId,
    modifierMateriel,
    desactiverMateriel
};
