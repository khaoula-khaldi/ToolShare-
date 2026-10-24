const express = require("express");
const router = express.Router();

const magasinController = require("../controllers/magasinController");

router.post("/", magasinController.creer);
router.get("/", magasinController.obtenirTous);
router.get("/:id", magasinController.obtenirParId);
router.patch("/:id", magasinController.modifier);
router.delete("/:id", magasinController.supprimer);

module.exports = router;
