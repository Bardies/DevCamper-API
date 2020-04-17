
const ErrorRes = require('../utils/error_response')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const Bootcamp = require('../models/Bootcamp')   //model in mongo bd with particular schema
//@desc         GET all bootcamps
//@route        '/api/v1/bootcamps'
//@access       puplic
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    //try {
    //==== USE FILTERING ====
    //console.log(req.query)
    let query;

    //we take a copy to remove select from it and in the same time we want to check if the fields are exist in rq.query or not
    let reqQuery = { ...req.query }


    //delete fields
    let removeFields = ['select', 'sort']
    removeFields.forEach(param => delete reqQuery[param])
    let queryStr = JSON.stringify(reqQuery);


    //replace(str|regex, replacement|function) >> function (match, offset, ...) called for each match and return value will be the replacement
    //REGEX:  g > global (the entire string not the first word we met only)
    queryStr = queryStr.replace(/\b(in|gt|gte|lt|lte)\b/g, match => `$${match}`);
    query = Bootcamp.find(JSON.parse(queryStr))                      //find (obj) 

    //chech the fields and do an action on the query that use it to fetch from the DB
    console.log(`select: ${req.query.select}`)
    if (req.query.select) {
        const fields = req.query.select.split(',').join(" ")     // >> ['name', 'description'] >> name description
        query = query.select(fields)                             // query.select('field1 field2 field3')
    }

    //sort (split >> returns an "array", join >> returns a "string")
    console.log(`sort: ${req.query.sort}`);
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(" ")
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }

    const bootcamps = await query

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
    // } catch (err) {
    // res.status(400).json({ success: false })
    //    next(err)

    //  }
})



//@desc         GET a bootcamp
//@route        '/api/v1/bootcamp/:id'
//@access       puplic
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    //  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    /*if the same format of id but no bootcamp exist with this id the try will be executed with data: null
     HANDLE THIS ERROR BY THE FOLLOWING IF
    */
    if (!bootcamp) {
        //RETURN TO ENSURE NOT EXECUTING THE RES.STATUS(200) AFTER THIS PART OF CODE

        //return res.status(400).json({ success: false })

        /* By using error handler in NODE JS
            >> the difference between this line and the one in catch is 
                in this line the id is the same format but no bootcamp exist with this id
                in catch the id format is incorrect so the code won't search for this id but catch error immediately
        */
        /* CREATE INSTANCE OF THE CLASS ERRORRES AND SEND MSG, STUTUS CODE TO RUN THE CONSTRUCTOR
                ####### HOW THIS ERROR WILL APPEAR IN THE RESPONSE ??
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
    //try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success: true,
        data: bootcamp
    })

    //} catch (err) {
    //    next(err)
    //}

})

//@desc         DELETE particular bootcamp
//@route        '/api/v1/bootcamps/:id'
//@access       private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    // try {
    const removed_bootcamp = await Bootcamp.findByIdAndRemove(req.params.id);
    if (!bootcamp) {
        //return res.status(400).json({ success: false })
        return next(
            new ErrorRes(`there is no bootcamp with id = ${req.params.id}`, 404)
        )
    }
    res.status(200).json({ success: true, deleted: removed_bootcamp })
    // } catch (err) {
    //res.status(400).json({ success: false })
    //    next(err)
    //}

    //res.status(200).json({ success: true, msg: `delete the bootcamp its id is ${req.params.id}` });
})


//@desc         UPDATE a particular bootcamp
//@route        '/api/v1/bootcamps/:id'
//@access       private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    //  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,    //return the updated bootcamp in bootcamp var.
        runValidators: true  //apply the validators in schema on the updated data
    })
    if (!bootcamp) {
        // here we know the error so we set the values of message and status code

        return next(
            new ErrorRes(`there is no bootcamp with id = ${req.params.id}`, 404)
        )
    }
    res.status(200).json({ success: true, updated_data: bootcamp });
    //  } catch (err) {
    //res.status(400).json({ success: false })
    //     next(err)
    //}


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



/*
 (module is discrete program in single file)
 module object representing the current module (meta data about module like id and file name)
 to use the functions existed in this module in another module we use module.exports =~ exports
 here there are more than one function so use this way (exports.function)
 sigle function/class > module.exports = func_name/class

*/
