const reservationRepository = require("../repositories/reservationRepository");
const materielRepository = require("../repositories/materielRepository");
const materielService = require("./materielService");
const AppError = require("../utils/AppError");

const VERROU_DUREE_MS = 10000;
const VERROU_TENTATIVES = 10;
const VERROU_ATTENTE_MS = 50;

const attendre = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const nonDisponible = (dispo) => {
    const err = new AppError(dispo.raison || "Matériel non disponible sur ce créneau.", 409);
    err.details = { conflits: dispo.conflits };
    return err;
};

const prendreVerrou = async (materielId) => {
    for (let tentative = 1; tentative <= VERROU_TENTATIVES; tentative++) {
        const verrou = await materielRepository.verrouiller(materielId, VERROU_DUREE_MS);
        if (verrou) return verrou;
        if (tentative < VERROU_TENTATIVES) await attendre(VERROU_ATTENTE_MS);
    }
    throw new AppError("Ce matériel est très sollicité en ce moment. Réessayez.", 409);
};

const creerReservation = async (actor, data = {}) => {
    const { magasinId, materielId, dateDebut, duree } = data;

    if (!magasinId || !materielId || dateDebut === undefined || duree === undefined) {
        throw new AppError("magasinId, materielId, dateDebut et duree sont obligatoires.", 400);
    }

    const criteres = { magasinId, dateDebut, duree };

    const dispo = await materielService.verifierDisponibilite(materielId, criteres);
    if (!dispo.disponible) throw nonDisponible(dispo);

    const verrou = await prendreVerrou(materielId);

    try {
        const dispoFinale = await materielService.verifierDisponibilite(materielId, criteres);
        if (!dispoFinale.disponible) throw nonDisponible(dispoFinale);

        return await reservationRepository.creer({
            utilisateurId: actor.id,
            materielId,
            magasinId,
            dateDebut: dispoFinale.dateDebut,
            dureeHeures: dispoFinale.dureeHeures,
            dateFin: dispoFinale.dateFin,
            statut: "CONFIRMEE"
        });
    } finally {
        await materielRepository.deverrouiller(materielId, verrou);
    }
};

module.exports = {
    creerReservation
};