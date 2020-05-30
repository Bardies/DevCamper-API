//require >> to import the model/library/framework to our code THEN we make instance by express()
const express = require('express');
//load env. vars from .env file into process.env(process> global obj., env> prop. returns obj. contains the user environment)
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload')
const path = require('path')
const cookieParser = require('cookie-parser')

const app = express();
//Middleware for logging in NODEJS
//const morgan = require('morgan');
//const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler')
const connect_db = require('./config/db')

//LOAD ENV. VARS
dotenv.config({ path: './config/config.env' });

// CONNECT THE DATABASE..
connect_db()

//LOAD ROUTES
const bootcamps_router = require('./routes/bootcamps');
const courses_router = require('./routes/courses');
const auth_router = require('./routes/auth')

//middleware generic to all paths >> '/api/v1/bootcamps'
/*

    1- HTTP REQ. (/api/v1/bootcamps + route exist in bootcamps_router & method) >> server
    2- depending on the route and method function in controller will be excuted >> routes
    3- this function in controller file will has the response                   >> controllers

*/
/*
    MIDDLEWARE >> FUNCTIONS CALLED BETWEEN PROCESSING REQUEST AND SENDING RESPONSE
    express.json >> used in POST & PUT requests >> in those methods we send data to the server (data enclosed in the body)
    and the server will extract that data from the body of request
    Express provides middleware to deal with this data >> express.json & express.urlencooded and we can use it as middleware by 
    calling inside app.use()
    express.json >> method built in express to recognize the incoming data as JSON OBJECT
    express.urlencoded >> method built in express to recognize the incoming data as string or array

*/
// dev logger (Middleware for logging in NODEJS)
/*if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}*/


//ENABLE US TO PARSE THE BODY
app.use(express.json());

// we use it to access the cookie header
app.use(cookieParser());

//add static folder
app.use(express.static(path.join(__dirname, 'public')))

//file uplaod
app.use(fileUpload());

//Routes 
app.use('/api/v1/bootcamps', bootcamps_router);
app.use('/api/v1/courses', courses_router);
app.use('/api/v1/auth', auth_router);

/*Order in Middleware is important, linear in execution of middleware
    >> You define error-handling middleware last, after other app.use() and routes calls

this is a custom error handler function if it isn't exist the built in one will be executed instead
*/
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

// WHAT IS VARIABLE SERVER CONTAIN? 
const server = app.listen(
    PORT,
    console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT} `)
);


//  TERMINATE THE PROCESS ..

process.on('unhandledRejection', (err, promise) => {
    console.log(`Erorr: ${err.message}`);
    server.close(() => { process.exit(1) })
});


/*ERROR HANDLER
    **Express’s default error handler will:
        Set the HTTP Status to 500 (internal server)
        Sends a text response to the requester
        Logs the text response in the console

    **If you want to handle an asynchronous error, you need to send the error into an express error handler through the next argument.

    **Express will stop using its default error handler once you create a custom error handler.
    To handle an error, you need to communicate with the frontend that’s requesting the endpoint. This means you need to:

    Send over a valid HTTP status code
    Send over a valid response




*/

