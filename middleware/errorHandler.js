const ErrorRes = require('../utils/error_response')
//BUILD CUSTOM ERROR HANDLER ABOVE NEXT(ERR) >> ERROR HANDLER IN NODE JS

/*after using the class ErrorRes the err passed to the error handler arrow function is
 instance os tha class has 2 properties message and statusCose*/

const errorHandler = (err, req, res, next) => {
    //we don't want to make seperate response for each error
    let error = { ...err }      //spread operator (copy of error object)
    //err passed to error handler via next and Error class in Node has message property(error has method message & err.message has value) 

    //error.message = err.message;

    console.log(error.message);             ///FOR DEVELOPMENT..
    console.log(error.name)
    //CUSTOMIZE ERROR HANDELING 
    /* ==========BAD ID============== */
    if (err.name === 'CastError') {
        const message = `there is no resource with id = ${err.value}`  //middleware (between request and response so we can see req.params)
        error = new ErrorRes(message, 404);
    }
    /* ==========DUPLICATION=============== */
    if (err.code === 11000) {
        const message = "Duplication";
        error = new ErrorRes(message, 400);
    }
    /*===========ValidationError >> things "required" in the schema of the model don't exist/ be filled ============== */
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => val.message)   //array of errors(err.errors (object))
        error = new ErrorRes(message, 400)
    }

    /* 1- VALID RESPONSE TO THE USER (FRONT END)
       2-  AND HTTP STATUS CODE                 */
    res.status(error.statusCode || 500).json({
        success: false,
        Error: error.message || 'Server error'
    });
};

module.exports = errorHandler;