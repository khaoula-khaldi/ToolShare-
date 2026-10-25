const express = require("express");
const router = express.Router();

const magasinController = require("../controllers/magasinController");
const authMiddleware = require("../middlewares/authenticate");
const authorize = require("../middlewares/gestionnaireAuthorization");

router.post("/",authMiddleware,authorize , magasinController.creer);
router.get("/", authMiddleware,authorize ,magasinController.obtenirTous);
router.get("/:id", authMiddleware,authorize ,magasinController.obtenirParId);
router.patch("/:id",authMiddleware,authorize , magasinController.modifier);
router.delete("/:id",authMiddleware,authorize , magasinController.supprimer);

module.exports = router;
