const { Int32 } = require('mongodb');
const mongoose = require('mongoose');

const reviewSchema = ({
    review:{
        type: String
    },
    userID: {
        type: String
    },
    restaurantID:{
        type: String
    }
})

const Review = mongoose.model("review", reviewSchema);
module.exports = Review;
