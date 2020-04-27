const express = require('express');
const coursesRouter = require('./courses')
// A Router instance is a complete middleware and routing system
const router = express.Router();
const Bootcamp = require('../models/Bootcamp')
const Course = require('../models/Course')
const { protect, authorizeRole } = require('../middleware/auth')
const advancedResults = require('../middleware/advancedResults')

/* if we're here(api/v1/bootcamps) and find this route >> pass it to courseRouter */
router.use('/:bootcampId/courses', coursesRouter)      //rather than inculde get courses handler and make a seperate route to it
const {
    getBootcamp,
    getBootcamps,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampByRadius,
    uploadBootcampImage
} = require('../controllers/bootcamps');

router
    .route('/')
    .get(advancedResults(Bootcamp, 'COURSES'), getBootcamps)
    .post(protect, authorizeRole('admin', 'publisher'), createBootcamp);

router.route('/:id/photo').put(uploadBootcampImage)

router
    .route('/:id')
    .get(getBootcamp)
    .delete(protect, authorizeRole('admin', 'publisher'), deleteBootcamp)
    .put(protect, authorizeRole('admin', 'publisher'), updateBootcamp)

router.route('/radius/:zipcode/:distance').get(getBootcampByRadius);




module.exports = router;