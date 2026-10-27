const express = require('express');
const router = express.Router();
const {me,createGestionnaire,affecterMagasin,getMonMagasin } = require('../controllers/userController');
const  authenticate = require('../middlewares/authenticate')
const asyncHandler = require('../utils/AsyncHandler');
const { createGestionnaireSchema } = require('../validations/user.zod');
const  {validateBody} = require('../middlewares/validate');
const authorize = require('../middlewares/authorize');
/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get the logged-in user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user (without password)
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/me', authenticate , asyncHandler(me));

router.post('/create' , authenticate , validateBody(createGestionnaireSchema) , asyncHandler(createGestionnaire))

/**
 * @openapi
 * /api/users/gestionnaires/{id}/magasin:
 *   patch:
 *     tags: [Users]
 *     summary: Affecter un magasin à un gestionnaire
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du gestionnaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - magasinId
 *             properties:
 *               magasinId:
 *                 type: string
 *                 description: ID du magasin
 *     responses:
 *       200:
 *         description: Magasin affecté avec succès
 *       400:
 *         description: Identifiant invalide
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès réservé à l'admin
 *       404:
 *         description: Gestionnaire ou magasin introuvable
 *       409:
 *         description: Magasin déjà affecté
 */
router.patch('/gestionnaires/:id/magasin',authenticate,authorize('admin'),asyncHandler(affecterMagasin));

/**
 * @openapi
 * /api/users/mon-magasin:
 *   get:
 *     tags:
 *       - Gestionnaire
 *     summary: Consulter les informations de son magasin affecté
 *     description: Permet au gestionnaire connecté de consulter les informations du magasin qui lui est affecté. Le gestionnaire ne peut consulter que son propre magasin.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations du magasin récupérées avec succès
 *       401:
 *         description: Authentification requise ou token invalide
 *       403:
 *         description: Accès interdit. Seul un gestionnaire peut accéder à cette ressource
 *       404:
 *         description: Aucun magasin affecté au gestionnaire ou magasin introuvable
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/mon-magasin',authenticate,authorize('gestionnaire'),asyncHandler(getMonMagasin));


module.exports = router;