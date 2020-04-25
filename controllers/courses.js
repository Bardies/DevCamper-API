
const ErrorRes = require('../utils/error_response')
const asyncHandler = require('../middleware/async')
const Course = require('../models/Course')
const Bootcamp = require('../models/Course')


//@desc      Get courses
//@route     GET /v1/courses
//@route     GET /v1/bootcamps/:bootcampId/courses
//@access    public

exports.getCourses = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {

        //Bootcamp courses no need to use pagination or select
        const courses = await Course.find({ bootcamp: req.params.bootcampId })
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });

    } else {
        res.status(200).json(res.advancedResults)
    }



});


//@desc      Get course
//@route     GET /v1/courses/:id
//@access    public

exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return next(
            new ErrorRes(`No course with id: ${req.params.id}`, 404)
        )
    }

    res.status(200).json({
        success: true,
        data: course

    })
});

//@desc                create course in bootcamp
//@route               POST /v1/bootcamps/:bootcampId/courses
//@access              Private


exports.createCourse = asyncHandler(async (req, res, next) => {
    //add prop in body called bootcamp its value is bootcamp id
    req.body.bootcamp = req.params.bootcampId
    const bootcamp = Bootcamp.findById(req.params.bootcampId)
    if (!bootcamp) {
        return next(
            ErrorRes(`No bootcamp with id: ${req.params.bootcampId}`)
        )
    }

    // body sent to server as a JSON obj
    const course = Course.create(req.body)   //but the body doen't take bootcamp id so we will assign it manually
    res.status(200).json({
        success: true,
        data: course,

    })
})


//@desc                update course in bootcamp
//@route               PUT /v1/courses/:id
//@access              Private


exports.updateCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id)
    if (!course) {
        return next(
            ErrorRes(`No course with id: ${req.params.id}`)
        )
    }

    updated_course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        data: updated_course,

    })
})

//@desc                delete course in bootcamp
//@route               DELETE /v1/courses/:id
//@access              Private



exports.deleteCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id)

    if (!course) {
        return next(
            ErrorRes(`No course with id: ${req.params.id}`)
        )
    }

    await course.remove();

    res.status(200).json({
        success: true,
        data: {}

    })
})


/*
//@desc                update course in bootcamp
//@route               PUT /v1/bootcamps/:bootcampId/courses/:id
//@access              Private


exports.updateCourse = asyncHandler(async (req, res, next) => {
    //add prop in body called bootcamp its value is bootcamp id
    req.body.bootcamp = req.params.bootcampId
    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    const course = await Course.findById(req.params.courseId)
    if (!bootcamp) {
        return next(
            ErrorRes(`No bootcamp with id: ${req.params.bootcampId}`)
        )
    }
    if (!course) {
        return next(
            ErrorRes(`No bootcamp with id: ${req.params.bootcampId}`)
        )
    }

    course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        data: course,

    })
})

//@desc                delete course in bootcamp
//@route               DELETE /v1/bootcamps/:bootcampId/courses/:id
//@access              Private



exports.deleteCourse = asyncHandler(async (req, res, next) => {
    //add prop in body called bootcamp its value is bootcamp id
    req.body.bootcamp = req.params.bootcampId
    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    const course = await Course.findById(req.params.courseId)
    if (!bootcamp) {
        return next(
            ErrorRes(`No bootcamp with id: ${req.params.bootcampId}`)
        )
    }
    if (!course) {
        return next(
            ErrorRes(`No bootcamp with id: ${req.params.bootcampId}`)
        )
    }

    course = await Course.findByIdAndDelete(req.params.courseId)
    res.status(200).json({
        success: true,
        data: course,

    })
})*/