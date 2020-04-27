const User = require('../models/User');
const asyncHandler = require('./async');
const jwt = require('jsonwebtoken')
const ErrorRes = require('../utils/error_response')

/* 1- Protect Routes
       - access authorization header >> extract the token (and ensure that it exists) [Bearer token]
       - detect the user via its id (in token) and set (req.user = user)

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
});

//Grant access to specific roles
/* 
    we will pass the roles supposed to access this route to this middleware 
    for ex. create bootcamps i set that its admin role >> so i will pass admin to this middleware
    Now admin in roles 'I' chose to access the route
    user logged in >> token >> hit the route >> protect executed(req.user) >> authorize role
    authorize role(take roles) if the role of logged in user in roles >> next()>> complete the route handler execution
*/
exports.authorizeRole = (...roles) => {
    return (req, res, next) => {
        //we here access req.user >> so we need first to implement "protect" middleware
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorRes(`this role: ${req.user.role}, not supposed to access this route`, 403)   //403 >> forbidden
            )
        }
        next();
    }
}