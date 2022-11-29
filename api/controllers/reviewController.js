const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');

//get the array of the users favorites
const getFavorites = asyncHandler(async (req, res) => {
    const { userID } = req.body;

    let user;
    if (userID) {
        user = await User.findOne({ _id: userID });
    }

    if (!user) {
        res.status(400).send("2 user not found");
        throw new Error("user not found");
    }
    else {
        const favorites = user.favorite;

        res.status(200).json({
            favorites
        });
    }
});

//add a businessID from a users favorite array
const addFavorite = asyncHandler(async (req, res) => {
    const { userID, businessID } = req.body;

    let user;
    if (userID) {
        user = await User.findOne({ _id: userID });
    }

    if (!user) {
        res.status(400).send("2 user not found");
        throw new Error("user not found");
    }

    //check if the user has already favorited this business
    if( user.favorite.indexOf(businessID) >= 0 )
    {
        res.status(400).send("8 already favorited");
        throw new Error("user not found");
    }

    user.favorite.push(businessID);
    user.save();

    res.status(201).send("added");
    
});

//remove a businessID from a users favorite array
const removeFavorite = asyncHandler(async (req, res) => {
    const { userID, businessID } = req.body;

    let user;
    if (userID) {
        user = await User.findOne({ _id: userID });
    }

    if (!user) {
        res.status(400).send("2 user not found");
        throw new Error("user not found");
    }
    else {
        user.favorite.remove(businessID);
        user.save();

        res.status(201).send("removed");
    }
});

module.exports = {
    getFavorites,
    addFavorite,
    removeFavorite,
};