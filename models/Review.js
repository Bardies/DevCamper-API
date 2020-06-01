
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title for the review'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Please add some text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating between 1 and 10']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }

});

reviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });
/*
    * match will get all reviews that has bootcamp = bootcampId
    * group will make this reviews as a group >> manage us to make avg operation on them(group the input with this id)
    * on this group do the avg operation and puth the result in avgRate
    * then on bootcamp model update the bootcamp averageRating with the value in avgRate
 */
reviewSchema.statics.AvgRate = async function (bootcampId) {   //CALCULATE AVG RATE OF BOOTCAMP AND UPDATE DB WITH IT
    //this refers to model review
    const arr = await this.aggregate([
        { $match: { bootcamp: bootcampId } },
        { $group: { _id: '$bootcamp', avgRate: { $avg: '$rating' } } }   //avg >> operator, $rating >> rating in model
    ]);
    console.log(arr);
    //now we need to add this field to the db
    try {
        await this.model('Bootcamp').findByIdAndUpdate({    //update the bootcamp model with the "averageRating" of the bootcamp
            averageRating: arr[0].avgRate
        })
    } catch (err) {

    }
}

// ============== MIDDLEWARES IN MONGOOSE (HOOKS) =========================

//for each comment added or deleted update the avgRating of its  bootcamp
reviewSchema.post('save', function () {
    //console.log(`this refers to: ${this}`);         //object of the document
    //console.log(`this.constructor: ${this.constructor}`);
    this.constructor.AvgRate(this.bootcamp)         //this refers to bootcamp
});

reviewSchema.pre('remove', function () {
    this.constructor.AvgRate(this.bootcamp)
});

module.exports = mongoose.model('Review', reviewSchema)

/*
 * Data modelling is the process of taking unstructured real-world data and putting it into a structured, logical data model
 */