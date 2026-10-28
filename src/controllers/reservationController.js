const reservationService = require("../services/reservationService");
const asyncHandler = require("../utils/AsyncHandler");

const creer = asyncHandler(async (req, res) => {
    const reservation = await reservationService.creerReservation(req.user, req.body || {});

    return res.status(201).json({
        success: true,
        message: "Réservation confirmée.",
        data: reservation
    });
});

const mesReservations = asyncHandler(async (req, res) => {
    const result = await reservationService.obtenirMesReservations(req.user, req.query);

    return res.status(200).json({
        success: true,
        ...result
    });
});

const maReservation = asyncHandler(async (req, res) => {
    const reservation = await reservationService.obtenirMaReservation(req.user, req.params.id);

    return res.status(200).json({
        success: true,
        data: reservation
    });
});

module.exports = {
    creer,
    mesReservations,
    maReservation
};