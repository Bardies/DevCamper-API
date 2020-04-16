
/*const ErrorRes = require('../utils/error_response')
const asyncHandler = require('../middleware/async')
const Course = require('../models/Course')

//@desc      Get courses
//@route     GET /v1/courses
//@route     GET /v1/bootcamps/:bootcampId/courses
//@access    public

exports.getCourses = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId });
    } else {
        const courses = await Course.find()
    }

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });
});*/