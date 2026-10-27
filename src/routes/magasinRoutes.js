const express = require("express");
const router = express.Router();
const {magasinSchema} = require("../validations/magasin.zod")
const magasinController = require("../controllers/magasinController");

const authenticate = require('../middlewares/authenticate')
const authorize = require('../middlewares/authorize')

router.post("/" , authenticate , authorize('admin') , magasinController.creer);
router.get("/",authenticate , authorize('admin') , magasinController.obtenirTous);
router.get("/:id",authenticate , authorize('admin') , magasinController.obtenirParId);
router.patch("/:id",authenticate , authorize('admin') , magasinController.modifier);
router.patch("/:id",authenticate , authorize('admin') , magasinController.disactive);
router.delete("/:id",authenticate , authorize('admin') , magasinController.supprimer);


module.exports = router;
