const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
    points: 4,
    duration: 60
})

const rateLimiterMiddleware = (req, res, next)=>{
    rateLimiter.consume(req.ip)
    .then((x)=>{
        // console.log('remaining points: '+ x.remainingPoints);
        res.locals.captchaRequired=false;
        next();
    })
    .catch((x)=>{
        res.locals.captchaRequired=true;
        next();
    })
}

module.exports = rateLimiterMiddleware;