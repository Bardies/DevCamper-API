const express = require("express")
const Review = require('../models/Review')
const advancedResults = require('../middleware/advancedResults')
const { protect, authorizeRole } = require('../middleware/auth')
const { getReviews, getReview } = require('../controllers/reviews')

const router = express.Router({ mergeParams: true });
router.route('/')
    .get(advancedResults(Review), getReviews)

router.route('/:id')
    .get(getReview)


module.exports = router