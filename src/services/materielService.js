const mongoose = require("mongoose");
const materielRepository = require("../repositories/materielRepository");
const magasinRepository = require("../repositories/magasinRepository");
const reservationRepository = require("../repositories/reservationRepository");
const AppError = require("../utils/AppError");

const ETATS = ["BON", "ENDOMMAGE", "EN_MAINTENANCE"];
const DISPONIBILITES_MANUELLES = ["DISPONIBLE", "INDISPONIBLE"];

const assertObjectId = (id, label = "Id du matériel") => {
    if (!mongoose.isValidObjectId(id)) throw new AppError(`${label} invalide.`, 400);
};

const isFilled = (value) => typeof value === "string" && value.trim() !== "";

const verifierEnum = (value, valeurs, champ) => {
    if (value !== undefined && !valeurs.includes(value)) {
        throw new AppError(`${champ} invalide. Valeurs possibles : ${valeurs.join(", ")}.`, 400);
    }
};

const creerMateriel = async (data = {}) => {
    if (!isFilled(data.nom) || !data.magasinId) {
        throw new AppError("Le nom et le magasin sont obligatoires.", 400);
    }
    assertObjectId(data.magasinId, "Id du magasin");
    verifierEnum(data.etat, ETATS, "État");

    const magasin = await magasinRepository.trouverParId(data.magasinId);
    if (!magasin) throw new AppError("Magasin introuvable.", 404);
    if (!magasin.actif) throw new AppError("Impossible d'ajouter un matériel à un magasin désactivé.", 400);

    return await materielRepository.creer({
        nom: data.nom,
        description: data.description,
        etat: data.etat,
        magasinId: data.magasinId
    });
};

const obtenirTousLesMateriels = async (filtres = {}) => {
    const filtre = {};

    if (filtres.magasinId !== undefined) {
        assertObjectId(filtres.magasinId, "Id du magasin");
        filtre.magasinId = filtres.magasinId;
    }
    if (filtres.disponibilite !== undefined) {
        verifierEnum(filtres.disponibilite, ["DISPONIBLE", "INDISPONIBLE", "EMPRUNTE"], "Disponibilité");
        filtre.disponibilite = filtres.disponibilite;
    }
    if (filtres.etat !== undefined) {
        verifierEnum(filtres.etat, ETATS, "État");
        filtre.etat = filtres.etat;
    }
    if (filtres.actif === "true" || filtres.actif === "false") {
        filtre.actif = filtres.actif === "true";
    }

    return await materielRepository.trouverTous(filtre);
};

const obtenirMaterielParId = async (id) => {
    assertObjectId(id);
    const materiel = await materielRepository.trouverParId(id);

    if (!materiel) {
        throw new AppError("Matériel introuvable.", 404);
    }

    return materiel;
};

const modifierMateriel = async (id, data = {}) => {
    assertObjectId(id);
    const champs = {};
    if (data.nom !== undefined) {
        if (!isFilled(data.nom)) throw new AppError("Le nom ne peut pas être vide.", 400);
        champs.nom = data.nom;
    }
    if (data.description !== undefined) champs.description = data.description;
    if (data.etat !== undefined) {
        verifierEnum(data.etat, ETATS, "État");
        champs.etat = data.etat;
    }
    if (data.disponibilite !== undefined) {
        verifierEnum(data.disponibilite, DISPONIBILITES_MANUELLES, "Disponibilité");
        champs.disponibilite = data.disponibilite;
    }

    if (!Object.keys(champs).length) {
        throw new AppError("Au moins un champ (nom, description, etat, disponibilite) est obligatoire.", 400);
    }

    const actuel = await obtenirMaterielParId(id);
    if (champs.disponibilite && actuel.disponibilite === "EMPRUNTE") {
        throw new AppError("Matériel actuellement emprunté : enregistrez d'abord son retour.", 409);
    }

    return await materielRepository.modifierParId(id, champs);
};

const desactiverMateriel = async (id) => {
    const materiel = await obtenirMaterielParId(id);

    if (!materiel.actif) {
        throw new AppError("Matériel déjà désactivé.", 400);
    }

    return await materielRepository.modifierParId(id, { actif: false });
};


const HEURE_MS = 60 * 60 * 1000;

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
    if (Number.isNaN(fin.getTime())) throw new AppError("Durée trop longue.", 400);

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