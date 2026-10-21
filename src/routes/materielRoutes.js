const express = require("express");
const router = express.Router();

const materielController = require("../controllers/materielController");

router.post("/", materielController.creer);

router.get("/", materielController.obtenirTous);

router.get("/:id", materielController.obtenirParId);

router.patch("/:id", materielController.modifier);

router.patch("/:id/desactiver", materielController.desactiver);

module.exports = router;
