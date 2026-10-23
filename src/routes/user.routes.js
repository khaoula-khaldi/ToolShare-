const express = require('express');
const router = express.Router();
const {me,createGestionnaire} = require('../controllers/userController');
const  authenticate = require('../middlewares/authenticate')
const asyncHandler = require('../utils/AsyncHandler');
const { createGestionnaireSchema } = require('../validations/user.zod');
const  {validateBody} = require('../middlewares/validate')
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

module.exports = router;