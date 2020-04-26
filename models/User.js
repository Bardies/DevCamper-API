const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});


//Encrypt password
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
});

//generate token
//we need to apply method on one document from the db >> so we will use schema methods
//we want to send the token in the response so we will call this func in register controller
userSchema.methods.getToken = function () {
    return token = jwt.sign({ id: this._id }, process.env.Secret, { expiresIn: process.env.expire })
}

// to compare password entered by a found user(email is found in db) with hashed password in db 
userSchema.methods.checkPassword = async function (entered_password) {
    return await bcrypt.compare(entered_password, this.password)         // returns true or false(plain text password, encrypted password)

}

module.exports = mongoose.model('User', userSchema)