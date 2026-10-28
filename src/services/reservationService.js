const reservationRepository = require("../repositories/reservationRepository");
const materielRepository = require("../repositories/materielRepository");
const materielService = require("./materielService");
const AppError = require("../utils/AppError");

const nonDisponible = (dispo) => {
    const err = new AppError(dispo.raison || "Matériel non disponible sur ce créneau.", 409);
    err.details = { conflits: dispo.conflits };
    return err;
};


const creerReservation = async (actor, data = {}) => {
    const { magasinId, materielId, dateDebut, duree } = data;

    if (!magasinId || !materielId || dateDebut === undefined || duree === undefined) {
        throw new AppError("magasinId, materielId, dateDebut et duree sont obligatoires.", 400);
    }

    const criteres = { magasinId, dateDebut, duree };

    
    const dispo = await materielService.verifierDisponibilite(materielId, criteres);
    if (!dispo.disponible) throw nonDisponible(dispo);

    const verrou = await materielRepository.verrouiller(materielId);
    if (!verrou) {
        throw new AppError("Une autre réservation est en cours sur ce matériel. Réessayez.", 409);
    }

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
        await materielRepository.deverrouiller(materielId);
    }
};

module.exports = {
    creerReservation
};