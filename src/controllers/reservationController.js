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

module.exports = {
    creer
};