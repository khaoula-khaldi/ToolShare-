const magasinService = require("../services/magasinService");
const asyncHandler = require("../utils/AsyncHandler");

const creer = asyncHandler(async (req, res) => {
    const magasin = await magasinService.creerMagasin(req.body || {});

    return res.status(201).json({
        success: true,
        message: "Magasin créé avec succès.",
        data: magasin
    });
});

const obtenirTous = asyncHandler(async (req, res) => {
    const magasins = await magasinService.obtenirTousLesMagasins();

    return res.status(200).json({ success: true, data: magasins });
});

const obtenirParId = asyncHandler(async (req, res) => {
    const magasin = await magasinService.obtenirMagasinParId(req.params.id);

    return res.status(200).json({ success: true, data: magasin });
});

const modifier = asyncHandler(async (req, res) => {
    const magasin = await magasinService.modifierMagasin(req.params.id, req.body || {});

    return res.status(200).json({
        success: true,
        message: "Magasin modifié avec succès.",
        data: magasin
    });
});

const supprimer = asyncHandler(async (req, res) => {
    const magasin = await magasinService.supprimerMagasin(req.params.id);

    return res.status(200).json({
        success: true,
        message: "Magasin supprimé avec succès.",
        data: magasin
    });
});

const disactive = asyncHandler(async (req, res) => {
    const magasin = await magasinService.disactiveMagasinbyId(req.params.id);

    return res.status(200).json({
        success: true,
        message: "Magasin désactivé avec succès.",
        data: magasin
    });
});

module.exports = {
    creer,
    obtenirTous,
    obtenirParId,
    modifier,
    supprimer,
    disactive
};