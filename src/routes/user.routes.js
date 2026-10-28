const router = require('express').Router();
const ctrl = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');
const authorize  = require('../middlewares/authorize');

router.use(authenticate);

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: Gestion des comptes admin, gestionnaire et user
 */

/**
 * @openapi
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Créer un compte
 *     description: Admin crée tous les rôles. Gestionnaire crée uniquement des comptes user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateUserInput' }
 *     responses:
 *       201:
 *         description: Compte créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/User' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       409: { description: Email déjà utilisé }
 *   get:
 *     tags: [Users]
 *     summary: Lister les comptes
 *     description: Gestionnaire ne voit que les comptes user.
 *     parameters:
 *       - { in: query, name: role, schema: { type: string, enum: [admin, gestionnaire, user] } }
 *       - { in: query, name: status, schema: { type: string, enum: ['true', 'false'] } }
 *       - { in: query, name: magasin, schema: { type: string } }
 *       - { in: query, name: search, schema: { type: string }, description: Recherche par nom ou email }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 20, maximum: 100 } }
 *     responses:
 *       200:
 *         description: Liste paginée
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PaginatedUsers' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 */
router.post('/', authorize('admin', 'gestionnaire'), ctrl.create);
router.get('/', authorize('admin', 'gestionnaire'), ctrl.list);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Consulter un compte
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Compte
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/User' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Users]
 *     summary: Modifier un compte (admin)
 *     description: Permet aussi de modifier l'affectation d'un gestionnaire.
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateUserInput' }
 *     responses:
 *       200: { description: Compte modifié }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { description: Email déjà utilisé }
 */
router.get('/:id', authorize('admin', 'gestionnaire'), ctrl.getOne);
router.patch('/:id', authorize('admin'), ctrl.update);

/**
 * @openapi
 * /users/{id}/status:
 *   patch:
 *     tags: [Users]
 *     summary: Désactiver ou réactiver un compte (admin)
 *     description: Désactivation logique, l'historique est conservé.
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: boolean, example: false }
 *     responses:
 *       200: { description: Statut mis à jour }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.patch('/:id/status', authorize('admin'), ctrl.setStatus);

module.exports = router;