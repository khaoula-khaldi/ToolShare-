const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const asyncHandler = require('../utils/AsyncHandler');
const {validateBody} = require('../middlewares/validate');
const { loginSchema } = require('../validations/user.zod');



router.post('/login',validateBody(loginSchema) ,  asyncHandler(login));


module.exports = router;