const reservationRepository = require("../repositories/reservationRepository");
const materielRepository = require("../repositories/materielRepository");
const materielService = require("./materielService");
const magasinRepository = require("../repositories/magasinRepository");
const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const { STATUTS } = require("../models/Reservation");

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


const toPlain = (doc) => (doc && typeof doc.toJSON === "function" ? doc.toJSON() : doc);

const formaterReservation = (reservation, maintenant = new Date()) => {
    const r = toPlain(reservation);
    const { materielId, magasinId, utilisateurId, ...reste } = r;

    return {
        ...reste,
        materiel: materielId && typeof materielId === "object" && materielId.nom !== undefined
            ? { id: materielId._id ?? materielId.id, nom: materielId.nom, description: materielId.description, etat: materielId.etat }
            : materielId,
        magasin: magasinId && typeof magasinId === "object" && magasinId.nom !== undefined
            ? { id: magasinId._id ?? magasinId.id, nom: magasinId.nom, adresse: magasinId.adresse }
            : magasinId,
        enRetard: r.statut === "EN_COURS" && new Date(r.dateFin) < maintenant
    };
};

const parseDate = (value, champ) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) throw new AppError(`${champ} invalide.`, 400);
    return date;
};

const obtenirMesReservations = async (actor, query = {}) => {
    const filtre = { utilisateurId: actor.id };

    if (query.statut) {
        const statuts = String(query.statut).split(",").map((s) => s.trim().toUpperCase());
        const invalides = statuts.filter((s) => !STATUTS.includes(s));
        if (invalides.length) {
            throw new AppError(`Statut invalide. Valeurs possibles : ${STATUTS.join(", ")}.`, 400);
        }
        filtre.statut = statuts.length === 1 ? statuts[0] : { $in: statuts };
    }

    if (query.du) filtre.dateFin = { $gt: parseDate(query.du, "Date 'du'") };
    if (query.au) filtre.dateDebut = { $lt: parseDate(query.au, "Date 'au'") };
    if (query.du && query.au && filtre.dateFin.$gt >= filtre.dateDebut.$lt) {
        throw new AppError("La date 'du' doit être avant la date 'au'.", 400);
    }

    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);

    const [reservations, total] = await Promise.all([
        reservationRepository.trouverParUtilisateur(filtre, { skip: (page - 1) * limit, limit }),
        reservationRepository.compter(filtre)
    ]);

    const maintenant = new Date();
    return {
        data: reservations.map((r) => formaterReservation(r, maintenant)),
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
    };
};

const obtenirMaReservation = async (actor, id) => {
    if (!mongoose.isValidObjectId(id)) throw new AppError("Id de la réservation invalide.", 400);

    const reservation = await reservationRepository.trouverParIdEtUtilisateur(id, actor.id);
    if (!reservation) throw new AppError("Réservation introuvable.", 404);

    return formaterReservation(reservation);
};

const obtenirReservationMagasin = async(acteur)=>{
    const magasin = await magasinRepository.findByGestionnaire(acteur.id);
    if(!magasin){
        throw new AppError("Aucun magasin associé à ce gestionnaire",404);
    }
    return await reservationRepository.trouverParMagasin(magasin._id);
}

module.exports = {
    creerReservation,
    obtenirMesReservations,
    obtenirMaReservation,
    obtenirReservationMagasin
};