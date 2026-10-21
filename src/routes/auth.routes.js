const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const asyncHandler = require('../utils/AsyncHandler');
const {validateBody} = require('../middlewares/validate');
const { loginSchema } = require('../validations/user.zod');


/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in and receive a JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       200:
 *         description: Logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *       400:
 *         description: Validation error
 *       401:
 *         description: Wrong email or password
 */
router.post('/login',validateBody(loginSchema) ,  asyncHandler(login));


module.exports = router;