const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authenticate");
const authorize = require("../middlewares/gestionnaireAuthorization");
const userController = require("../controllers/gestionnaireUser.controller");

/**
 * @swagger
 * /api/createUser:
 *   post:
 *     summary: Créer un compte utilisateur
 *     description: Permet au gestionnaire de créer un compte utilisateur sans lui attribuer un rôle privilégié.
 *     tags:
 *       - Gestionnaire - Utilisateurs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ahmed Benali"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "ahmed@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *     responses:
 *       '201':
 *         description: Compte utilisateur créé avec succès
 *       '400':
 *         description: Données invalides
 *       '401':
 *         description: Authentification requise
 *       '403':
 *         description: Accès interdit au rôle actuel
 *       '409':
 *         description: Un compte avec cet email existe déjà
 *       '500':
 *         description: Erreur interne du serveur
 */


router.post("/",authMiddleware,authorize, userController.create);
module.exports = router;

