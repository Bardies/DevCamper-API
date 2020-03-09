const express = require('express');
const dotenv = require('dotenv');
const app = express();
const morgan = require('morgan');
//const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler')
const connect_db = require('./config/db')

//LOAD ENV. VARS
dotenv.config({ path: './config/config.env' });

// CONNECT THE DATABASE..
connect_db()

//LOAD ROUTES
const bootcamps_router = require('./routes/bootcamps');

//middleware generic to all paths >> '/api/v1/bootcamps'
/*

    1- HTTP REQ. (/api/v1/bootcamps + route exist in bootcamps_router & method) >> server
    2- depending on the route and method function in controller will be excuted >> routes
    3- this function in controller file will has the response                   >> controllers

*/
// dev logger (Middleware for logging in NODEJS)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//ENABLE US TO PARSE THE BODY
app.use(express.json());
//Routes 
app.use('/api/v1/bootcamps', bootcamps_router);
//Order in Middleware is important, linear in execution of middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

// WHAT IS VARIABLE SERVER CONTAIN? 
const server = app.listen(
    PORT,
    console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT} `)
);

process.on('unhandledRejection', (err, promise) => {
    console.log(`Erorr: ${err.message}`);
    server.close(() => { process.exit(1) })
})
