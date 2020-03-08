const express = require('express');
const router = express.Router();
const {
    getBootcamp,
    getBootcamps,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp
} = require('../controllers/bootcamps');

router
    .route('/')
    .get(getBootcamps)
    .post(createBootcamp);


router
    .route('/:id')
    .get(getBootcamp)
    .post(createBootcamp)
    .delete(deleteBootcamp)
    .put(updateBootcamp);


module.exports = router;