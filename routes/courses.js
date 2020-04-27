const express = require("express")
const advancedResults = require('../middleware/advancedResults')
const Course = require('../models/Course')
const { protect, authorizeRole } = require('../middleware/auth')


// to use request parameters of the bootcamp router in handler of this route that exist in another router
const router = express.Router({ mergeParams: true });
const { getCourses, getCourse, createCourse, deleteCourse, updateCourse } = require('../controllers/courses')    //{} >> don't forget

//in bootcamp router the /:bootcampId/courses is hit so now the route matched is (/) with method get
router
    .route('/')
    .get(advancedResults(Course, {
        path: 'bootcamp',                 //field
        select: 'name description'       //fields to show
    }), getCourses)
    .post(protect, authorizeRole('admin', 'publisher'), createCourse)
router
    .route('/:id')
    .get(getCourse)
    .delete(protect, authorizeRole('admin', 'publisher'), deleteCourse)
    .put(protect, authorizeRole('admin', 'publisher'), updateCourse)


module.exports = router

