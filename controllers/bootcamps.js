
const ErrorRes = require('../utils/error_response')

const Bootcamp = require('../models/Bootcamp')   //model in mongo bd with particular schema
//@desc         GET all bootcamps
//@route        '/api/v1/bootcamps'
//@access       puplic
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();

        res.status(200).json({
            success: true,
            count: bootcamps.length(),
            data: bootcamps
        })
    } catch (err) {
        res.status(400).json({ success: false })

    }
}

//@desc         GET a bootcamp
//@route        '/api/v1/bootcamp/:id'
//@access       puplic
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        /*if the same format of id but no bootcamp exist with this id the try will be executed with data: null
         HANDLE THIS ERROR BY THE FOLLOWING IF
        */
        if (!bootcamp) {
            //RETURN TO ENSURE NOT EXECUTING THE RES.STATUS(200) AFTER THIS PART OF CODE
            //return res.status(400).json({ success: false })
            /* By using error handler in NODE JS
                the difference between this line and the one in catch is 
                 in this line the id is the same format but no bootcamp exist with this id
                 in catch the id format is incorrect so the code won't search for this id but catch error immediately
            */

            next(new ErrorRes(`there is no bootcamp with id = ${req.params.id}`, 404))
        }

        res.status(200).json({
            success: true,
            data: bootcamp
        });


    } catch (err) {
        //res.status(400).json({ success: false })

        //ERROR HANDLING IN NODE JS
        //next(err)

        //HADLE THE ERROR USING THE CLASS
        next(new ErrorRes(`there is no bootcamp with id = ${req.params.id}`, 404));


    }

}

//@desc          CREATE new bootcamp
//@route        '/api/v1/bootcamps'
//@access       private
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
            success: true,
            data: bootcamp
        })

    } catch (err) {
        res.status(400).json({
            success: false
        })
    }

}

//@desc         DELETE particular bootcamp
//@route        '/api/v1/bootcamps/:id'
//@access       private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const removed_bootcamp = await Bootcamp.findByIdAndRemove(req.params.id);
        if (!bootcamp) {
            return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, deleted: removed_bootcamp })
    } catch (error) {
        res.status(400).json({ success: false })
    }

    res.status(200).json({ success: true, msg: `delete the bootcamp its id is ${req.params.id}` });
}


//@desc         UPDATE a particular bootcamp
//@route        '/api/v1/bootcamps/:id'
//@access       private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,    //return the updated bootcamp in bootcamp var.
            runValidators: true  //apply the validators in schema on the updated data
        })
        if (!bootcamp) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, updated_data: bootcamp });
    } catch (error) {
        res.status(400).json({ success: false })
    }


}


/*
 (module is discrete program in single file)
 module object representing the current module (meta data about module like id and file name)
 to use the functions existed in this model in another model we use module.exports == exports
 here there are more than one function so we require the whole file in other modules

*/
