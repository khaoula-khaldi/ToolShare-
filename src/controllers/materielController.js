
const materielService = require("../services/materielService");

const creer = async (req, res) => {
    try {
        const materiel = await materielService.creerMateriel(req.body);

        return res.status(201).json({
            message: "Matériel créé avec succès.",
            data: materiel
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

const obtenirTous = async (req, res) => {
    try {
        const materiels = await materielService.obtenirTousLesMateriels(
            req.query
        );

        return res.status(200).json({
            data: materiels
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const obtenirParId = async (req, res) => {
    try {
        const materiel = await materielService.obtenirMaterielParId(
            req.params.id
        );

        return res.status(200).json({
            data: materiel
        });
    } catch (error) {
        const status = error.message === "Matériel introuvable." ? 404 : 500;

        return res.status(status).json({
            message: error.message
        });
    }
};

const modifier = async (req, res) => {
    try {
        const materiel = await materielService.modifierMateriel(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            message: "Matériel modifié avec succès.",
            data: materiel
        });
    } catch (error) {
        const status = error.message === "Matériel introuvable." ? 404 : 400;

        return res.status(status).json({
            message: error.message
        });
    }
};

const desactiver = async (req, res) => {
    try {
        const materiel = await materielService.desactiverMateriel(
            req.params.id
        );

        return res.status(200).json({
            message: "Matériel désactivé avec succès.",
            data: materiel
        });
    } catch (error) {
        const status = error.message === "Matériel introuvable." ? 404 : 500;

        return res.status(status).json({
            message: error.message
        });
    }
};

module.exports = {
    creer,
    obtenirTous,
    obtenirParId,
    modifier,
    desactiver
};
