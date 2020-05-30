const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

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
    // here this is a copy of the new document we want to save in th DB.
    if (this.isModified('password')) {    //check the current password anf the one in DB.
        //console.log('not modified password')
        //next();
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt)
    }


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

// Reset password token
userSchema.methods.getResetPasswordToken = function () {
    /*
        1- generate the token (random bytes), BYCRPT >> just hash not generate 
        2- hash the token and set (resetPasswordToken)
        3- set (resetPasswordExpire)
        4- return the unhashed token

     */
    // give a buffer so we used toString, bytes >> 'hex'
    const reset_token = crypto.randomBytes(20).toString('hex');
    //apply on actual user (in the route forgot password) so we ca access this user
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(reset_token)                    //apply the hash algorithm on eset_token
        .digest('hex')                          //digest determine the data format

    // Reset the expire (10 minutes)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

    return reset_token


}

module.exports = mongoose.model('User', userSchema)

//If the current middleware function does not end the request-response cycle,
// it must call next() to pass control to the next middleware function.