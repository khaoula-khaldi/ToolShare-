const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize")

const materielController = require("../controllers/materielController");

router.post("/",authorize("admin    ","administrator") ,materielController.creer);

router.get("/", materielController.obtenirTous);

router.get("/:id", materielController.obtenirParId);

router.patch("/:id", materielController.modifier);

router.patch("/:id/desactiver", materielController.desactiver);

module.exports = router;
