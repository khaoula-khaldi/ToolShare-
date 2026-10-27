const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authenticate");
const authorize = require("../middlewares/gestionnaireAuthorization");
const materielController = require("../controllers/materielController");

/**
 * @swagger
 * /api/materiels:
 *   post:
 *     summary: Créer un matériel
 *     tags: [Matériels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Matériel créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès interdit
 */
router.post("/", authMiddleware, authorize, materielController.creer);

/**
 * @swagger
 * /api/materiels:
 *   get:
 *     summary: Obtenir tous les matériels
 *     tags: [Matériels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des matériels récupérée avec succès
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès interdit
 */
router.get("/", authMiddleware, authorize, materielController.obtenirTous);

/**
 * @swagger
 * /api/materiels/{id}:
 *   get:
 *     summary: Obtenir un matériel par son ID
 *     tags: [Matériels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant du matériel
 *     responses:
 *       200:
 *         description: Matériel récupéré avec succès
 *       400:
 *         description: Identifiant invalide
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Matériel introuvable
 */
router.get("/:id", authMiddleware, authorize, materielController.obtenirParId);

/**
 * @swagger
 * /api/materiels/{id}:
 *   patch:
 *     summary: Modifier un matériel
 *     tags: [Matériels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant du matériel
 *     responses:
 *       200:
 *         description: Matériel modifié avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Matériel introuvable
 */
router.patch("/:id", authMiddleware, authorize, materielController.modifier);

/**
 * @swagger
 * /api/materiels/{id}/desactiver:
 *   patch:
 *     summary: Désactiver un matériel
 *     description: Désactive un matériel sans le supprimer définitivement.
 *     tags: [Matériels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant du matériel à désactiver
 *     responses:
 *       200:
 *         description: Matériel désactivé avec succès
 *       400:
 *         description: Identifiant invalide
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Matériel introuvable
 */
router.patch("/:id/desactiver", authMiddleware, authorize, materielController.desactiver);


module.exports = router;