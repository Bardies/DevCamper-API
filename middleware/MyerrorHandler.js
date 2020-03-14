

const errorHandler = (err, req, res, next) => {
    if (err.name === 'CastError') {
        const message = `there is no resource with id = ${err.value}`;
        err.message = message;
        status = 404;
    }
    res.status(status).json({
        success: false,
        error: err.message
    })

}

module.exports = errorHandler;

