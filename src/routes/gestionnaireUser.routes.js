const express = require("express");
const router = express.Router();
const userController = require("../controllers/gestionnaireUser.controller");

router.post("/", userController.create);
module.exports = router;

