const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authenticate");
const authorize = require("../middlewares/gestionnaireAuthorization");
const materielController = require("../controllers/materielController");

/**
 * @swagger
 * /materiels/{id}/disponibilite:
 *   get:
 *     summary: Vérifier la disponibilité d'un matériel sur un créneau
 *     description: >
 *       Accessible à tout compte connecté. Le créneau va de dateDebut à dateDebut + duree (heures).
 *       Un créneau peut commencer exactement à la fin d'une réservation existante.
 *       Les réservations annulées ou terminées libèrent le créneau.
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
 *       - in: query
 *         name: dateDebut
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *           example: '2026-11-03T09:00:00.000Z'
 *         description: Date et heure de début (ISO 8601), pas dans le passé
 *       - in: query
 *         name: duree
 *         required: true
 *         schema:
 *           type: number
 *           minimum: 0
 *           exclusiveMinimum: true
 *           example: 3
 *         description: Durée en heures, strictement positive
 *       - in: query
 *         name: magasinId
 *         schema:
 *           type: string
 *         description: Magasin sélectionné, vérifie que le matériel lui appartient
 *     responses:
 *       200:
 *         description: Résultat de la vérification (disponible ou non)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     materielId: { type: string }
 *                     magasinId: { type: string }
 *                     dateDebut: { type: string, format: date-time }
 *                     dateFin: { type: string, format: date-time }
 *                     dureeHeures: { type: number, example: 3 }
 *                     disponible: { type: boolean, example: false }
 *                     raison: { type: string, nullable: true, example: 'Le créneau chevauche une réservation existante.' }
 *                     conflits:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           dateDebut: { type: string, format: date-time }
 *                           dateFin: { type: string, format: date-time }
 *                           statut: { type: string, enum: [CONFIRMEE, EN_COURS] }
 *       400:
 *         description: Id invalide, date passée ou invalide, durée non positive, matériel hors du magasin sélectionné
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Matériel ou magasin introuvable ou désactivé
 */
router.get("/:id/disponibilite", authMiddleware, materielController.verifierDisponibilite);

/**
 * @swagger
 * /materiels:
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
 * /materiels:
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
 * /materiels/{id}:
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
 * /materiels/{id}:
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
 * /materiels/{id}/desactiver:
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