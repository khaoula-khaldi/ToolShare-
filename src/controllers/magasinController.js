
const magasinService = require("../services/magasinService");

const creer = async (req, res) => {
    try {
        const magasin = await magasinService.creerMagasin(req.body);

        return res.status(201).json({
            message: "Magasin créé avec succès.",
            data: magasin
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

const obtenirTous = async (req, res) => {
    try {
        const magasins = await magasinService.obtenirTousLesMagasins();

        return res.status(200).json({ data: magasins });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const obtenirParId = async (req, res) => {
    try {
        const magasin = await magasinService.obtenirMagasinParId(req.params.id);

        return res.status(200).json({ data: magasin });
    } catch (error) {
        const status = error.message === "Magasin introuvable." ? 404 : 500;

        return res.status(status).json({ message: error.message });
    }
};

const modifier = async (req, res) => {
    try {
        const magasin = await magasinService.modifierMagasin(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            message: "Magasin modifié avec succès.",
            data: magasin
        });
    } catch (error) {
        const status = error.message === "Magasin introuvable." ? 404 : 400;

        return res.status(status).json({ message: error.message });
    }
};

const supprimer = async (req, res) => {
    try {
        const magasin = await magasinService.supprimerMagasin(req.params.id);

        return res.status(200).json({
            message: "Magasin supprimé avec succès.",
            data: magasin
        });
    } catch (error) {
        const status = error.message === "Magasin introuvable." ? 404 : 500;

        return res.status(status).json({ message: error.message });
    }
};

module.exports = {
    creer,
    obtenirTous,
    obtenirParId,
    modifier,
    supprimer
};
