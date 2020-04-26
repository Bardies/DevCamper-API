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

    res.status(200).json({
        success: true
    })

})

