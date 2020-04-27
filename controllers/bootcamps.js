
const ErrorRes = require('../utils/error_response')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const path = require('path')
const Bootcamp = require('../models/Bootcamp')   //model in mongo bd with particular schema
//@desc         GET all bootcamps
//@route        '/api/v1/bootcamps'
//@access       puplic
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults)

})



//@desc         GET a bootcamp
//@route        '/api/v1/bootcamp/:id'
//@access       puplic
exports.getBootcamp = asyncHandler(async (req, res, next) => {


    const bootcamp = await Bootcamp.findById(req.params.id);
    /*if the same format of id but no bootcamp exist with this id the try will be executed with data: null
     HANDLE THIS ERROR BY THE FOLLOWING IF
    */
    if (!bootcamp) {

        //return res.status(400).json({ success: false })

        /* By using error handler in NODE JS
            >> the difference between this line and the one in catch is 
                in this line the id is the same format but no bootcamp exist with this id
                in catch the id format is incorrect so the code won't search for this id but catch error immediately
        */
        /* CREATE INSTANCE OF THE CLASS ERRORRES AND SEND MSG, STUTUS CODE TO RUN THE CONSTRUCTOR
                ####### HOW THIS ERROR WILL APPEAR IN THE RESPONSE ??
                            - errorHandler
        */

        return next(
            new ErrorRes(`there is no bootcamp with id = ${req.params.id}`, 404)
        )
    }

    res.status(200).json({
        success: true,
        data: bootcamp
    });


    //  } catch (err) {

    // 1- res.status(400).json({ success: false })

    /*Default error handler in "EXPRESS"
                
        For errors returned from asynchronous functions invoked by route handlers and middleware
        you must pass them to the next() function, where Express will catch and process them
    */
    //2- next(err)

    //HADLE THE ERROR USING THE CLASS
    //next(new ErrorRes(`there is no bootcamp with id = ${req.params.id}`, 404));
    /*next has argument err >> express assume there is an error >> leave all routes and send whatever passed to next to youy error handler
        error handler(err, req, res, next) >> if no error handler express will execute its error handler 
    */
    //console.log(req.params.id)
    //next(err);

    //  }

});

//@desc          CREATE new bootcamp
//@route        '/api/v1/bootcamps'
//@access        private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    // Add user to req.body ro be associated with the bootcamp
    req.body.user = req.user.id;                                //req.user >>from protect middleware

    // Publisher >> add only one bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });
    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(
            new ErrorRes(`the user with id: ${req.user.name}, has already published a bootcamp`)
        )
    }
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success: true,
        data: bootcamp
    })

})

//@desc         DELETE particular bootcamp
//@route        '/api/v1/bootcamps/:id'
//@access       private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    // try {

    const removed_bootcamp = await Bootcamp.findById(req.params.id);
    if (!removed_bootcamp) {
        //return res.status(400).json({ success: false })
        return next(
            new ErrorRes(`there is no bootcamp with id = ${req.params.id}`, 404)
        )
    }
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorRes(`the user with id: ${req.user.id} unauthorized to delete this bootcamp`, 401)
        )
    }

    removed_bootcamp.remove();

    res.status(200).json({ success: true, deleted: {} })

})


//@desc         UPDATE a particular bootcamp
//@route        '/api/v1/bootcamps/:id'
//@access       private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    let bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {

        return next(
            new ErrorRes(`there is no bootcamp with id = ${req.params.id}`, 404)
        )
    }

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorRes(`the user with id: ${req.user.id} unauthorized to update this bootcamp`, 401)
        )
    }
    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,                                                          //return the updated bootcamp in bootcamp var.
        runValidators: true                                                 //apply the validators in schema on the updated data
    })
    res.status(200).json({ success: true, updated_data: bootcamp });



});

//@desc         get bootcamps by radius
//@route        api/v1/bootcamps/radius/:zipcode/:distance
//@access       private

exports.getBootcampByRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    console.log(zipcode)
    //get langitude and latitude from geocoder
    const loc = await geocoder.geocode(zipcode);

    const long = loc[0].longitude;
    const lat = loc[0].latitude;

    //earth radius in miles is 3963
    const radius = distance / 3963

    console.log(`radius: ${radius}, long: ${long} and lat: ${lat}`)
    //Bootcamp.create - Bootcamp.find - Bootcamp.delete () [we apply this methods on the model]
    // Model >> on which we apply methods, Schema >> pattern of the data
    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[long, lat], radius] } }
    });

    console.log(`bootcamps: ${bootcamps}`)
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})

//@desc                 upload a bootcamp photo
//@route                PUT v1/bootcamps/:id/photo
//@access               Private
/*
====================== UPLOAD BOOTCAMP IMAGE ==============================

 *****server.js*******
    1- require the module express-fileupload
    2- add the middleware
 *****CONTROLLER******
    1- we need to upload photo from our device >> use express-fileupload package
    2- check bootcamp and req.files 
    3- check if the file is image - custom name to the image
    4- store the image on server using "mv func"
    5- update photo field in the bootcamp document
******Route**********
*/

exports.uploadBootcampImage = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    //console.log(req.files)
    //Chech the bootcamp id
    if (!bootcamp) {
        return next(
            new ErrorRes(`there is no bootcamp with id = ${req.params.id}`, 404)
        )
    }

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorRes(`the user with id: ${req.user.id} unauthorized to update this bootcamp`, 401)
        )
    }

    if (!req.files) {
        return next(
            new ErrorRes(`please upload a file`, 404)
        )
    }

    const file = req.files.file;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorRes(`Please upload an image file`, 400));
    }
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(
                `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
                400
            )
        );
    }

    //  Custom name to prevent override
    //use path module to extract the image extension from the the name
    file.name = `photo_${req.params.id}${path.parse(file.name).ext}`

    // Now we have a photo >> use mv func to move it to folder on server then update photo bootcamp
    file.mv(`${process.env.PUBLIC_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.log(err);
            return next(
                ErrorRes('problem with photo upload', 500)   //server error
            )
        }
        Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })
    })

    res.status(200).json({
        success: true,
        data: file.name
    })


})



/*
 (module is discrete program in single file)
 module object representing the current module (meta data about module like id and file name)
 to use the functions existed in this module in another module we use module.exports =~ exports
 here there are more than one function so use this way (exports.function)
 sigle function/class > module.exports = func_name/class

*/
