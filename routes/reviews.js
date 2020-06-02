const express = require("express")
const Review = require('../models/Review')
const advancedResults = require('../middleware/advancedResults')
const { protect, authorizeRole } = require('../middleware/auth')
const { getReviews, getReview, addReview, updateReview, deleteReview } = require('../controllers/reviews')

const router = express.Router({ mergeParams: true });
router.route('/')
    .get(advancedResults(Review), getReviews)
    .post(protect, authorizeRole('user', 'admin'), addReview)

router.route('/:id')
    .get(getReview)
    .put(protect, authorizeRole('admin', 'user'), updateReview)
    .delete(protect, authorizeRole('admin', 'user'), deleteReview)


module.exports = router