const express = require("express")

// to use request parameters of the bootcamp router in handler of this route that exist in another router
const router = express.Router({ mergeParams: true });
const { getCourses, getCourse, createCourse, deleteCourse, updateCourse } = require('../controllers/courses')    //{} >> don't forget

//in bootcamp router the /:bootcampId/courses is hit so now the route matched is (/) with method get
router
    .route('/')
    .get(getCourses)
    .post(createCourse)
router
    .route('/:id')
    .get(getCourse)
    .delete(deleteCourse)
    .put(updateCourse)


module.exports = router

