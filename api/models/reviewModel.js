const { Int32 } = require('mongodb');
const mongoose = require('mongoose');

const reviewSchema = ({
    review:{
        type: String,
        required: true,
    },
    userID: {
        type: String,
        required: true,
    },
    restaurantID:{
        type: String,
        required: true,
    }
})

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
