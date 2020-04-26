const User = require('../models/User');
const asyncHandler = require('./async');
const jwt = require('jsonwebtoken')
const ErrorRes = require('../utils/error_response')

/* 1- Protect Routes
       - access authorization header >> extract the token (and ensure that it exists) [Bearer token]
       - detect the user via its id (in token) and set req.user = user

*/

// Routes that need private access >> require login >> Authorization header so we create protect to check that

exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new ErrorRes('Not authorized to access this route', 401)
        )
    }

    // get the user with id exist in the token and set (req.user = user) >> TO ACCESS USER IN OTHER ROUTES in case of having authorization header
    try {
        const decoded = jwt.verify(token, process.env.Secret)  //(id, iat, exp)
        //console.log(decoded)

        req.user = await User.findById(decoded.id)
        next();
    } catch (err) {
        return next(
            new ErrorRes('Not authorized to access this route', 401)
        )
    }
})