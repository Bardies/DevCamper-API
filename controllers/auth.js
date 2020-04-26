const User = require('../models/User');
const asyncHandler = require('../middleware/async')
const ErrorRes = require('../utils/error_response')




//@desc             Register user
//@route            POST api/v1/auth/register
//@access           public
exports.register = asyncHandler(async (req, res, next) => {

    // Create a user with encrypted password
    const { name, email, password, role } = req.body;
    //without await success true will be appear even if error exists
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    // id created by db so after make user instance we apply getToken on it (now user has prop id)

    getCookieToken(user, 200, res);

});

//@desc             Login user
//@route            POST api/v1/auth/login
//@access           public

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    /*we will check if email and password are existed but in sign in we don't as
     we add validations in schema and these data will be passed to it to create the user
     but here we won't deal with any validations 
     just find user with entered mail and password
     */
    if (!email || !password) {
        return next(
            new ErrorRes('please enter email and password', 400)
        )
    }

    /*in schema password (select: false) because we don't want password to appear to users we we as example select users of bootcamps
    so user document that match the email won't include the password but we need this password to chech user login 
    so we use .select('+password) > which means, include the password that is supposed to be excluded
    */
    const user = await User.findOne({ email }).select('+password');
    // console.log(user)

    if (!user) {
        return next(
            new ErrorRes('Enter correct email and password', 401)  //401 >> UNAUTHORIZED USER
        )
    }

    // chech the password
    const matched = await user.checkPassword(password)

    if (!matched) {
        return next(
            new ErrorRes('Enter correct email and password', 401)  //401 >> UNAUTHORIZED USER
        )
    }

    getCookieToken(user, 200, res);



});


// function to generate the token, send it in cookie and send the response
const getCookieToken = function (user, statusCode, res) {
    //each time we login with the same email and password we get different token
    const token = user.getToken();

    const options = {
        expires: new Date(Date.now() + process.env.cookie_expire * 24 * 60 * 60 * 100),
        httpOnly: true

    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true           //https
    }

    // res.cookie >> send cookie in the respons
    res
        .status(statusCode)
        .cookie('Token', token, options)        //(key, value, options)
        .json({
            success: true, token
        })

}
