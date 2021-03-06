const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const rateLimiterMiddleware = require('./rateLimiter');

const routeConstants = require('./appConstants'); 

const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.json());
app.use((req, res, next)=>{
    // for allowing cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

// middleware for 3 times of a request from same ip
app.use(rateLimiterMiddleware);

// route for authentication
app.use(routeConstants.authRoute, authRoutes);

// Error middleware for centralized error handling
app.use((error, req, res, next)=>{
    console.log(error);
    const status = error.statusCode||500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message,
        data
    })
})

const DATABASE_URI = "mongodb+srv://kshitijk83:451422ere@paracticing-bfzmz.mongodb.net/test?retryWrites=true&w=majority";
// const DATABASE_URI =process.env.MONGODB_URI||'mongodb://localhost:27017/test';
mongoose.connect(DATABASE_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(res=>{
    app.listen(process.env.PORT||8080);
})
.catch(err=>{
    console.log(err);
})