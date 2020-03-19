const bcrypt = require('bcrypt');
const User = require('../models/User');
const constants = require('../appConstants');
const utils = require('../utils/utils');


exports.signup=(req, res, next)=>{
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.password;
    const recaptchaToken = req.body.recaptchaToken;
    let data;
    if(recaptchaToken){
        data = {
            remoteip: req.connection.remoteAddress,
            response: recaptchaToken,
            secret: '6LeLceIUAAAAAAJ3-5HljE7DF9YxOq8yV6juz50o'
        }
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