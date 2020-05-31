const User = require('../models/User');
const asyncHandler = require('../middleware/async')
const ErrorRes = require('../utils/error_response')


//@desc         get all users
//@route        GET api/v1/users
//@access       private/admin

/* 
    before the execution of this controller advanced results middleware will be executed:
        * add "advancedResults" prop to the "res" object >> this prop will give us the result
*/
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
});

//@desc         get a single user
//@route        GET api/v1/users/:id
//@access       private/admin

exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    res.status(200).json({
        success: true,
        data: user
    })
});

//@desc         create a single user
//@route        Post api/v1/users
//@access       private/admin

exports.createUser = asyncHandler(async (req, res, next) => {
    const createdUser = await User.create(req.body)
    res.status(200).json({
        success: true,
        data: createdUser
    })
});

//@desc         update user
//@route        PUT api/v1/users/:id
//@access       private/admin

exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,                  // return in "user" the updated version not the original
        runValidators: true
    }) //   TRY WRONG ID AND NOT EXISTING ONE ????
    res.status(200).json({
        success: true,
        data: user
    })
});

//@desc         delete user
//@route        DELETE api/v1/users/:id
//@access       private/admin

exports.deleteUser = asyncHandler(async (req, res, next) => {
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    res.status(200).json({
        success: true,
        data: deletedUser
    })
});


