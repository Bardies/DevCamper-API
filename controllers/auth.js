const User = require('../models/User');
const asyncHandler = require('../middleware/async')
const ErrorRes = require('../utils/error_response')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')



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
        + >> means include
        - >> means exclude
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


// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});


// @desc      Log the user out
// @route     GET /api/v1/auth/logout
// @access    Private
exports.logOut = asyncHandler(async (req, res, next) => {
    // cookie parser managed us to access cookies
    res.cookie('Token', 'none', {
        expires: new Date(Date.now() * 10 * 1000),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        data: {}
    });
});


//@desc             update the logged in user password
//@route            PUT api/v1/auth/updatePassword
//@access           private

exports.updatePassword = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id).select('+password')
    if (!(user.checkPassword(req.body.currentPassword))) {
        return next(new ErrorRes('incorrect password'), 401)
    }
    user.password = req.body.newPassword;
    await user.save()

    getCookieToken(user, 200, res);    //to keep user logged in

});

//@desc             update email and name for user 
//@route            PUT api/v1/auth/updateDetails
//@access           private

exports.updateDetails = asyncHandler(async (req, res, next) => {
    toUpdate = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id, toUpdate, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        user
    })
});

//@desc             reset the password
//@route            PUT api/v1/auth/resetPassword/:token
//@access           private

exports.resetPassword = asyncHandler(async (req, res, next) => {

    resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }

    });
    if (!user) {
        return next(new ErrorRes('Invalid token', 400))
    }

    user.password = req.body.password  // before save salt will be generated and hashed password will be saved
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save();

    // we want user to be logged in automatically after reset the password successfully
    getCookieToken(user, 200, res);


});


//@desc             Forgot password
//@route            GET api/v1/auth/forgotpassword
//@access           Public

/*
    1- find the user with email sent in the body
    2- generate password token and expiration date => set this fields in the db
    3- save the user => to save the fields we added recently
    4- send the response to the user with the hashed token saved in the document.
    4- send email with the url that user will visit to reset the password

*/

exports.forgotPassword = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(
            new ErrorRes('No user with that email', 404)
        )
    }

    const token = user.getResetPasswordToken();

    // now we need to save the user we just set the field but we don't create or save the document
    await user.save({ validateBeforeSave: false });

    // send the email with the reset url
    console.log(req.hostname);
    const reset_url = `${req.protocol}://${req.hostname}/api/v1/auth/resetPassword/${token}`;
    const msg = `click on this url to reset password ${reset_url}`

    try {
        await sendEmail({
            email: user.email,
            subject: "Reset Password",
            text: msg
        })

        res.status(200).json({
            success: true,
            data: 'email sent'
        })
    } catch (err) {
        console.log(err)
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false });

        return next(new ErrorRes('email could not be sent', 500))   //server error
    }


})
