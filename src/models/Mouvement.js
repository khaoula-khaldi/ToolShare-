const mongoose = require("mongoose");

const mouvementSchema = new mongoose.Schema(
    {
        reservationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reservation",
            required: true
        },
        materielId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Materiel",
            required: true
        },
        gestionnaireId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        type: {
            type: String,
            enum: ["REMISE", "RETOUR"],
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        etatRetour: {
            type: String,
            enum: ["BON", "ENDOMMAGE"],
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Mouvement", mouvementSchema);