const materielService = require("../services/materielService");
const asyncHandler = require("../utils/AsyncHandler");

const creer = asyncHandler(async (req, res) => {
    const materiel = await materielService.creerMateriel(req.body || {});

    return res.status(201).json({
        success: true,
        message: "Matériel créé avec succès.",
        data: materiel
    });
});

const obtenirTous = asyncHandler(async (req, res) => {
    const materiels = await materielService.obtenirTousLesMateriels(req.query);

    return res.status(200).json({
        success: true,
        data: materiels
    });
});

const obtenirParId = asyncHandler(async (req, res) => {
    const materiel = await materielService.obtenirMaterielParId(req.params.id);

    return res.status(200).json({
        success: true,
        data: materiel
    });
});

const modifier = asyncHandler(async (req, res) => {
    const materiel = await materielService.modifierMateriel(req.params.id, req.body || {});

    return res.status(200).json({
        success: true,
        message: "Matériel modifié avec succès.",
        data: materiel
    });
});

const desactiver = asyncHandler(async (req, res) => {
    const materiel = await materielService.desactiverMateriel(req.params.id);

    return res.status(200).json({
        success: true,
        message: "Matériel désactivé avec succès.",
        data: materiel
    });
});

const verifierDisponibilite = asyncHandler(async (req, res) => {
    const data = await materielService.verifierDisponibilite(req.params.id, req.query);

    return res.status(200).json({
        success: true,
        data
    });
});

module.exports = {
    creer,
    obtenirTous,
    obtenirParId,
    modifier,
    desactiver,
    verifierDisponibilite
};