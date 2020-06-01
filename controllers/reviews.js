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

//@desc      Add review to a bootcamp
//@route     POST /api/v1/bootcamps/:bootcampId
//@access    private(admin - users)

exports.addReview = asyncHandler(async (req, res, next) => {

    // review need the user and the bootcamp
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        return next(new ErrorRes('No bootcamp with this id', 404))
    }
    const review = await Review.create(req.body);

    res.status(201).json({
        success: true,
        data: review
    })


});

//@desc      update a review
//@route     PUT /api/v1/reviews/:id
//@access    private(admin - users)

exports.updateReview = asyncHandler(async (req, res, next) => {

    let review = await Review.findById(req.params.id);


    if (!review) {
        return next(new ErrorRes('No review with this id', 404))
    }

    console.log(`review.user: ${review.user}`);

    if (req.user.role !== 'admin' && review.user.toString() !== req.user.id) {
        return next(new ErrorRes('Not authorized to do that', 401))
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(201).json({
        success: true,
        data: review
    })


});

//@desc      delete a review
//@route     DELETE /api/v1/reviews/:id
//@access    private(admin - users)

exports.deleteReview = asyncHandler(async (req, res, next) => {

    let review = await Review.findById(req.params.id);


    if (!review) {
        return next(new ErrorRes('No review with this id', 404))
    }

    console.log(`review.user: ${review.user}`);

    if (req.user.role !== 'admin' && review.user.toString() !== req.user.id) {
        return next(new ErrorRes('Not authorized to do that', 401))
    }

    await Review.findByIdAndDelete(req.params.id, req.body)

    res.status(201).json({
        success: true,
        data: {}
    })


});

