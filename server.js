const express = require('express');
const dotenv = require('dotenv');
const app = express();
const morgan = require('morgan');
//const logger = require('./middleware/logger');

//LOAD ENV. VARS
dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT || 5000;

//LOAD ROUTES
const bootcamps_router = require('./routes/bootcamps');

//middleware generic to all paths >> '/api/v1/bootcamps'
/*

    1- HTTP REQ. (/api/v1/bootcamps + route exist in bootcamps_router & method) >> server
    2- depending on the route and method function in controller will be excuted >> routes
    3- this function in controller file will has the response                   >> controllers

*/
// dev logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use('/api/v1/bootcamps', bootcamps_router);



app.listen(
    PORT,
    console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT} `)
);
