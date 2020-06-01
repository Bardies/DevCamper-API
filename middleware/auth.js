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
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
        // Set token from cookie
    }

    else if (req.cookies.Token) {
        token = req.cookies.Token;
    }

    if (!token) {
        return next(
            new ErrorRes('No token', 401)
        )
    }


    // get the user with id exist in the token and set (req.user = user) >> TO ACCESS USER IN OTHER ROUTES in case of having authorization header
    try {
        const decoded = jwt.verify(token, process.env.Secret)  //(id, iat, exp)
        //console.log(decoded)

        req.user = await User.findById(decoded.id)

        console.log(`req.user: ${req.user}`)
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

/*
    we passed 2 arguments (admin, publisher) >> so we need to use 2 params in the function defention to recaive these values 
    and to be able to use then in the body
    but we may change the args passed (e.g. we want the admin only to create bootcamps) now the number of args are changed >> PROBLEM!!!
    THE SOLUTION IN using rest operator (will collect params into array)
*/
exports.authorizeRole = (...roles) => {    //roles now are array

    return (req, res, next) => {
        console.log(`req.user: ${req.user}`)             // return true or false
        //we here access req.user >> so we need first to implement "protect" middleware
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorRes(`this role: ${req.user.role}, not supposed to access this route`, 403)   //403 >> forbidden
            )
        }
        next();
    }
}