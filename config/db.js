
const mongoose = require('mongoose');

const connect_db = async () => {
    const conn = await mongoose.connect(process.env.mongoDB_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });

    console.log(`Mongo connection host ${conn.connection.host}`)
}

module.exports = connect_db;

