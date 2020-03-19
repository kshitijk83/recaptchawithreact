const express = require('express');
const routeConstants = require('../appConstants');
const authController = require('../controller/check');

const router = express.Router();

router.get('/', authController.check);

module.exports = router;