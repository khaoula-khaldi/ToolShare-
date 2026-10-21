const mongoose = require("mongoose");

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
        dateDebut: {
            type: Date,
            required: true
        },
        dateFin: {
            type: Date,
            required: true
        },
        statut: {
            type: String,
            enum: [
                "EN_ATTENTE",
                "VALIDEE",
                "REFUSEE",
                "EN_COURS",
                "TERMINEE",
                "ANNULEE"
            ],
            default: "EN_ATTENTE"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Reservation", reservationSchema);