const ErrorRes = require('../utils/error_response')
const asyncHandler = require('../middleware/async')
const Review = require('../models/Review')
const Bootcamp = require('../models/Bootcamp')

//@desc      Get reviews
//@route     GET /v1/reviews
//@route     GET /v1/bootcamps/:bootcampId/reviews
//@access    public

exports.getReviews = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {

        //Bootcamp reviews no need to use pagination or select
        const reviews = await Review.find({ bootcamp: req.params.bootcampId })
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });

    } else {
        res.status(200).json(res.advancedResults)
    }


});


//@desc      Get single review
//@route     GET /v1/reviews/:id
//@access    public

exports.getReview = asyncHandler(async (req, res, next) => {

    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',             // relate with the bootcamr which id us in "bootcamp" prop in the review document
        select: 'name description'   // name& description of the bootcamp
    })
    if (!review) {
        return next(new ErrorRes(`No review with the id ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        data: review
    })


});