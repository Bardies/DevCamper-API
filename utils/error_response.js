

class ErrorRes extends Error {
    constructor(message, statusCode) {
        super(message);                   //Error class has this property
        this.statusCode = statusCode;     //custom property
    }
}


module.exports = ErrorRes;