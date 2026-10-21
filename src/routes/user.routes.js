const express = require('express');
const router = express.Router();
const {me} = require('../controllers/userController');
const  authenticate = require('../middlewares/authenticate')
const asyncHandler = require('../utils/AsyncHandler')


router.get('/me', authenticate , asyncHandler(me));



module.exports = router;