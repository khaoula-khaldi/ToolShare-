const mongoose = require("mongoose");
const materielRepository = require("../repositories/materielRepository");
const magasinRepository = require("../repositories/magasinRepository");
const reservationRepository = require("../repositories/reservationRepository");
const AppError = require("../utils/AppError");

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


const HEURE_MS = 60 * 60 * 1000;

const assertObjectId = (id, label) => {
    if (!mongoose.isValidObjectId(id)) throw new AppError(`${label} invalide.`, 400);
};

const calculerCreneau = (dateDebut, duree, maintenant = new Date()) => {
    if (!dateDebut) throw new AppError("La date de début est obligatoire.", 400);

    const debut = new Date(dateDebut);
    if (Number.isNaN(debut.getTime())) throw new AppError("Date de début invalide.", 400);
    if (debut < maintenant) throw new AppError("La date de début ne peut pas être dans le passé.", 400);

    const dureeHeures = Number(duree);
    if (duree === undefined || duree === null || duree === "" || !Number.isFinite(dureeHeures) || dureeHeures <= 0) {
        throw new AppError("La durée (en heures) doit être strictement positive.", 400);
    }

    const fin = new Date(debut.getTime() + dureeHeures * HEURE_MS);
    return { debut, fin, dureeHeures };
};

const verifierDisponibilite = async (materielId, { magasinId, dateDebut, duree } = {}) => {
    assertObjectId(materielId, "Id du matériel");

    const maintenant = new Date();
    const { debut, fin, dureeHeures } = calculerCreneau(dateDebut, duree, maintenant);

    const materiel = await materielRepository.trouverParId(materielId);
    if (!materiel || !materiel.actif) throw new AppError("Matériel introuvable.", 404);

    if (magasinId !== undefined) {
        assertObjectId(magasinId, "Id du magasin");
        if (String(materiel.magasinId) !== String(magasinId)) {
            throw new AppError("Ce matériel n'appartient pas au magasin sélectionné.", 400);
        }
    }

    const magasin = await magasinRepository.trouverParId(materiel.magasinId);
    if (!magasin || !magasin.actif) throw new AppError("Magasin introuvable ou désactivé.", 404);

    const reponse = {
        materielId: materiel._id,
        magasinId: materiel.magasinId,
        dateDebut: debut,
        dateFin: fin,
        dureeHeures,
        disponible: true,
        raison: null,
        conflits: []
    };

    if (materiel.disponibilite === "INDISPONIBLE") {
        return { ...reponse, disponible: false, raison: "Matériel déclaré indisponible." };
    }

    const conflits = await reservationRepository.trouverChevauchements(materielId, debut, fin, maintenant);

    if (conflits.length) {
        return {
            ...reponse,
            disponible: false,
            raison: "Le créneau chevauche une réservation existante.",
            conflits: conflits.map((r) => ({ dateDebut: r.dateDebut, dateFin: r.dateFin, statut: r.statut }))
        };
    }

    return reponse;
};

module.exports = {
    creerMateriel,
    obtenirTousLesMateriels,
    obtenirMaterielParId,
    modifierMateriel,
    desactiverMateriel,
    calculerCreneau,
    verifierDisponibilite
};