exports.check = (req, res, next)=>{
    res.status(200).json({
        captchaRequired: res.locals.captchaRequired
        // captchaRequired: false
    });
}