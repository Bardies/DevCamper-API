//Here we want to seed the db and delete all in it...
/*
    1- import the data
    2- connect the db
    3- define function to add 
    4- define another function to delete
    5- determine how to execute this functions in my code

*/

const fs = require('fs');                           // import file system module
const mongoose = require('mongoose');
const dotenv = require('dotenv');                   //to connect the db uri (SEPERATE FILE)
dotenv.config({ path: './config/config.env' });
const Bootcamp = require('./models/Bootcamp');          //load the bootcamp model (schema)
const Course = require('./models/Course');



// 1- import the data (read json file)
//JSON.parse >> from json string to js object
const bootcamps = JSON.parse(fs.readFileSync('./_data/bootcamps.json'));
const courses = JSON.parse(fs.readFileSync('./_data/courses.json'))

// 2- connect the db (seperate connection cuz it's a seperate file)
mongoose.connect(process.env.mongoDB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
// 3- define add func. (async >> to avoid holding)
const addData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        //await Course.create(courses);
        console.log("add is done")
        process.exit();
    } catch (err) {
        console.error(err);                  // we need to end the response we aren't in express >> No next(err) > async
    }

};
// 4- define delete func.
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        console.log("delete is done")
        process.exit();
    } catch (err) {
        console.error(err);
    }

};

// 5- determine the functions execution
if (process.argv[2] === "-a") {
    addData();
} else if (process.argv[2] === "-d") {
    deleteData();
}






