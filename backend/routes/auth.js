const express = require('express');
const { body } = require('express-validator');
const User = require('../models/User');
const routeConstants = require('../appConstants');
const authController = require('../controller/auth');

const router = express.Router();

router.post(
    routeConstants.signupRoute,
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject(
                    'E-Mail exists already, please pick a different one.'
                    );
                }
                });
            })
            .normalizeEmail(),
        body(
            'password',
            'Please enter a password with only numbers and text and at least 4 characters.'
            )
            .isLength({ min: 4 })
            .isAlphanumeric()
            .trim()
    ],
    authController.signup);

module.exports = router;