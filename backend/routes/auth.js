const express = require('express');
const routeConstants = require('../appConstants');
const authController = require('../controller/auth');

const router = express.Router();

router.post(routeConstants.signupRoute, authController.signup);

module.exports = router;