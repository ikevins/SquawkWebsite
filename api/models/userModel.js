const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please enter your first name"]
    },
    lastName: {
        type: String,
        required: [true, "Please enter your last name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "please enter a valid email address"
        ]
    },
    password: {
        type: String,
        required: [true, "please add a password"],
        minLength: [6, "password must be at least 6 characters"],
    }
}, {
    timestamps: true,
})

const User = mongoose.model('User', userSchema);
module.exports = User;