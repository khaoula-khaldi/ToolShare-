const express = require("express");
const router = express.Router();
const { magasinSchema } = require("../validations/magasin.zod");
const magasinController = require("../controllers/magasinController");

const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const {validateBody} = require('../middlewares/validate');

router.use(authenticate, authorize('admin'));

/**
 * @openapi
 * tags:
 *   - name: Magasins
 *     description: Gestion des magasins (admin)
 * components:
 *   schemas:
 *     Magasin:
 *       type: object
 *       properties:
 *         id: { type: string, example: '665f1c2e8b3a4d0012ab34ce' }
 *         nom: { type: string, example: 'Magasin Safi Nord' }
 *         adresse: { type: string, example: 'Zone industrielle, Safi' }
 *         actif: { type: boolean, example: true }
 *         gestionnaireId: { type: string, nullable: true, description: 'Affecté via PATCH /users/{id}' }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *     MagasinInput:
 *       type: object
 *       required: [nom, adresse]
 *       properties:
 *         nom: { type: string, example: 'Magasin Safi Nord' }
 *         adresse: { type: string, example: 'Zone industrielle, Safi' }
 *     MagasinUpdateInput:
 *       type: object
 *       description: Au moins un champ
 *       properties:
 *         nom: { type: string, example: 'Magasin Safi Centre' }
 *         adresse: { type: string, example: 'Avenue Mohammed V, Safi' }
 *     MagasinResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: true }
 *         message: { type: string }
 *         data: { $ref: '#/components/schemas/Magasin' }
 */

/**
 * @openapi
 * /magasins:
 *   post:
 *     tags: [Magasins]
 *     summary: Créer un magasin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MagasinInput' }
 *     responses:
 *       201:
 *         description: Magasin créé
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MagasinResponse' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *   get:
 *     tags: [Magasins]
 *     summary: Lister tous les magasins (actifs et désactivés)
 *     responses:
 *       200:
 *         description: Liste des magasins
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: array, items: { $ref: '#/components/schemas/Magasin' } }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */
router.post("/", validateBody(magasinSchema), magasinController.creer);
router.get("/", magasinController.obtenirTous);

/**
 * @openapi
 * /magasins/{id}:
 *   get:
 *     tags: [Magasins]
 *     summary: Consulter un magasin
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Magasin
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MagasinResponse' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Magasins]
 *     summary: Modifier le nom ou l'adresse d'un magasin
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MagasinUpdateInput' }
 *     responses:
 *       200:
 *         description: Magasin modifié
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MagasinResponse' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get("/:id", magasinController.obtenirParId);
router.patch("/:id", validateBody(magasinSchema.partial()), magasinController.modifier);

/**
 * @openapi
 * /magasins/{id}/desactiver:
 *   patch:
 *     tags: [Magasins]
 *     summary: Désactiver un magasin
 *     description: Désactivation logique. L'historique, les matériels et les réservations sont conservés.
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Magasin désactivé
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MagasinResponse' }
 *       400: { description: Id invalide ou magasin déjà désactivé }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.patch("/:id/desactiver", magasinController.disactive);

module.exports = router;