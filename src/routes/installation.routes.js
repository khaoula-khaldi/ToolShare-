const express = require('express');
const router = express.Router();
const { install ,getStatus } = require('../controllers/installation');
const asyncHandler = require('../utils/AsyncHandler');
const {validateBody} = require('../middlewares/validate');
const { createUserSchema } = require('../validations/user.zod');

/**
 * @openapi
 * /api/installation/status:
 *   get:
 *     tags: [Installation]
 *     summary: Check if the app is already installed
 *     responses:
 *       200:
 *         description: Installation status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 installed: { type: boolean, example: false }
 */
router.get('/status', asyncHandler(getStatus));

/**
 * @openapi
 * /api/installation:
 *   post:
 *     tags: [Installation]
 *     summary: Run the initial installation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: Admin }
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       201:
 *         description: Installation done
 *       400:
 *         description: Validation error
 *       409:
 *         description: Already installed
 */
router.post('/', validateBody(createUserSchema) ,  asyncHandler(install));

module.exports = router