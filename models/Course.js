const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
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

//===========================================================================================

/*
    CALCUALTE AVERAGE COST:
        1- function to calculate avg cost - add it to db
        2- call it afte save any course
        3- call it before remove any course


*/
CourseSchema.statics.avgCost = async function (bootcampId) {
    //this refers to model course
    const arr = await this.aggregate([
        { $match: { bootcamp: bootcampId } },
        { $group: { _id: '$bootcamp', avgCost: { $avg: '$tuition' } } }
    ]);
    console.log(arr);
    //now we need to add this field to the db
    try {
        await this.model('Bootcamp').findByIdAndUpdate({
            avgCost: arr[0].avgCost
        })
    } catch (err) {

    }
}

CourseSchema.post('save', function () {
    //console.log(`this refers to: ${this}`);         //object of the document
    //console.log(`this.constructor: ${this.constructor}`);
    this.constructor.avgCost(this.bootcamp)         //this refers to bootcamp
});

CourseSchema.pre('remove', function () {
    this.constructor.avgCost(this.bootcamp)
});
//===========================================================================================



module.exports = mongoose.model('Course', CourseSchema);