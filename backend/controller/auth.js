const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const constants = require('../appConstants');
const utils = require('../utils/utils');


exports.signup=(req, res, next)=>{
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    const recaptchaToken = req.body.recaptchaToken;
    
    const errors = validationResult(req);
    // handling validation errors.
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).json({
          message: errors.array()[0].msg,
        });
      }

    let data;

    if(res.locals.captchaRequired&&recaptchaToken){ // if captcha is required and token is already there, verify it and then save the user data
        data = {
            remoteip: req.connection.remoteAddress,
            response: recaptchaToken,
            secret: '6LeLceIUAAAAAAJ3-5HljE7DF9YxOq8yV6juz50o'
        }
        return utils.verifyRecaptcha(data)
        .then(()=>{
            return bcrypt.hash(password, 12)
        })
        .then(hashedPsw=>{
            const user = new User({
                name,
                email,
                password: hashedPsw
            });
            return user.save();
        })
        .then(result=>{
            res.status(200).json({
                message: constants.userCreated,
                userId: result._id,
            });
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode=500;
            }
            next(err);
        })
    }
    else if(res.locals.captchaRequired&&!recaptchaToken){ // if captcha is required and token is not there, request for token first
        res.status(200).json({
            captchaRequired: res.locals.captchaRequired,
            message: "captcha is required"
        });
    } else{ // if recaptcha is not required, just save the user data
        return bcrypt.hash(password, 12)
        .then(hashedPsw=>{
            const user = new User({
                name,
                email,
                password: hashedPsw
            });
            return user.save();
        })
        .then(result=>{
            res.status(200).json({
                message: constants.userCreated,
                userId: result._id,
            });
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode=500;
            }
            next(err);
        })
    }
}