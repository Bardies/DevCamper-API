const User = require('../models/User');
const asyncHandler = require('../middleware/async')
const ErrorRes = require('../utils/error_response')




//@desc             Register user
//@route            POST api/v1/auth/register
//@access           public
exports.register = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true
    })

})

