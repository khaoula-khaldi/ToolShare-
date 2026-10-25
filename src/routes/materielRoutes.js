const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authenticate");
const authorize = require("../middlewares/gestionnaireAuthorization");

const materielController = require("../controllers/materielController");

router.post("/",authMiddleware,authorize ,materielController.creer);

router.get("/",authMiddleware,authorize, materielController.obtenirTous);

router.get("/:id",authMiddleware,authorize, materielController.obtenirParId);

router.patch("/:id",authMiddleware,authorize, materielController.modifier);

router.patch("/:id/desactiver",authMiddleware, authorize,materielController.desactiver);

module.exports = router;
