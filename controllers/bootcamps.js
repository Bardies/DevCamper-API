
//@desc         GET all bootcamps
//@route        '/api/v1/bootcamps'
//@access       puplic
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, msg: "show all bootcamps" });
}

//@desc         GET a bootcamp
//@route        '/api/v1/bootcamp/:id'
//@access       puplic
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: `show the bootcamp its id is ${req.params.id}` });
}

//@desc          CREATE new bootcamp
//@route        '/api/v1/bootcamps'
//@access       private
exports.createBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: "create the new bootcamp" });
}

//@desc         DELETE particular bootcamp
//@route        '/api/v1/bootcamps/:id'
//@access       private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: `delete the bootcamp its id is ${req.params.id}` });
}


//@desc         UPDATE a particular bootcamp
//@route        '/api/v1/bootcamps/:id'
//@access       private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: `update the bootcamp its id is ${req.params.id}` });
}


/*
 (module is discrete program in single file)
 module object representing the current module (meta data about module like id and file name)
 to use the functions existed in this model in another model we use module.exports == exports
 here there are more than one function so we require the whole file in other modules

*/
