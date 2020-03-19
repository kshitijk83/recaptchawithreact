const Recaptcha = require('recaptcha-v2').Recaptcha;
const constants = require('../appConstants');
exports.verifyRecaptcha = (recaptchaData)=>{
    return new Promise((res, rej)=>{
        const recaptcha = new Recaptcha(constants.SITE_KEY, constants.SECRET_KEY, recaptchaData);
        recaptcha.verify(success=>{
            if(success){
                return res();
            } else{
                const err = new Error('captcha not valid');
                err.statusCode = 401;
                return rej(err);
            }
        })
    })
}