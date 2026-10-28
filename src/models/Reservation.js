const mongoose = require("mongoose");

const STATUTS = ["CONFIRMEE", "ANNULEE", "EN_COURS", "TERMINEE"];

const STATUTS_ACTIFS = ["CONFIRMEE", "EN_COURS"];

const reservationSchema = new mongoose.Schema(
    {
        utilisateurId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        materielId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Materiel",
            required: true
        },
        magasinId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Magasin",
            required: true
        },
        dateDebut: {
            type: Date,
            required: true
        },
        dureeHeures: {
            type: Number,
            required: true,
            min: [0.01, "La durée doit être strictement positive."]
        },
        // Calculée: dateDebut + dureeHeures
        dateFin: {
            type: Date,
            required: true
        },
        statut: {
            type: String,
            enum: STATUTS,
            default: "CONFIRMEE"
        },
        // Remise w retour (gestionnaire)
        dateSortieReelle: {
            type: Date,
            default: null
        },
        dateRetourReelle: {
            type: Date,
            default: null
        },
        etatRetour: {
            type: String,
            enum: ["BON", "ENDOMMAGE", "EN_MAINTENANCE", null],
            default: null
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        }
    }
);

reservationSchema.index({ materielId: 1, statut: 1, dateDebut: 1, dateFin: 1 });

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
module.exports.STATUTS = STATUTS;
module.exports.STATUTS_ACTIFS = STATUTS_ACTIFS;