
//BUILD CUSTOM ERROR HANDLER ABOVE NEXT(ERR) >> ERROR HANDLER IN NODE JS

/*after using the class ErrorRes the err passed to the error handler arrow function is
 instance os tha class has 2 properties message and statusCose*/

const errorHandler = (err, req, res, next) => {
    //FOR DEVELOPMENT ..
    console.log(err.stack);
    //VALID RESPONSE TO THE USER (FRONT END) AND HTTP STATUS CODE
    res.status(err.statusCode).json({
        success: false,
        Error: err.message
    })
}

module.exports = errorHandler;