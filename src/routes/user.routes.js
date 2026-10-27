const express = require('express');
const router = express.Router();
const {me,createGestionnaire,affecterMagasin} = require('../controllers/userController');
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
module.exports = router;