const mongoose = require("mongoose");

const materielSchema = new mongoose.Schema(
    {
        nom: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true,
            default: ""
        },
        etat: {
            type: String,
            enum: ["BON", "ENDOMMAGE", "EN_MAINTENANCE"],
            default: "BON"
        },
        disponibilite: {
            type: String,
            enum: ["DISPONIBLE", "INDISPONIBLE", "EMPRUNTE"],
            default: "DISPONIBLE"
        },
        actif: {
            type: Boolean,
            default: true
        },
        magasinId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Magasin",
            required: true
        },
        verrouReservation: {
            type: Date,
            default: null,
            select: false
        }      

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Materiel", materielSchema);