const express = require('express');
const router = express.Router();
const { install ,getStatus } = require('../controllers/installation');
const asyncHandler = require('../utils/AsyncHandler');
const {validateBody} = require('../middlewares/validate');
const { createUserSchema } = require('../validations/user.zod');

router.get('/status', asyncHandler(getStatus));
router.post('/', validateBody(createUserSchema) ,  asyncHandler(install));

module.exports = router