const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
    points: 4,
    duration: 60*60 // 1 hour time limit for recaptcha timer
})

const rateLimiterMiddleware = (req, res, next)=>{
    rateLimiter.consume(req.ip)
    .then((x)=>{
        // if requests have been made, decrease the counter/points
        res.locals.captchaRequired=false;
        next();
    })
    .catch((x)=>{
        // if counter/points is 0, that means recaptcha is required for registering 
        res.locals.captchaRequired=true;
        next();
    })
}

module.exports = rateLimiterMiddleware;