const mongoose = require("mongoose");

const magasinSchema = new mongoose.Schema(
    {
        nom: {
            type: String,
            required: true,
            trim: true
        },
        adresse: {
            type: String,
            required: true,
            trim: true
        },
        actif : {
            type : Boolean , 
            default : true
        },
        gestionnaireId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    {
        timestamps: true , toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        }
    }
);

module.exports = mongoose.model("Magasin", magasinSchema);