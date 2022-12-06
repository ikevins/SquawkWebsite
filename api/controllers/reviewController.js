const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');


const Yelp = require('yelp-fusion');
const { json } = require('body-parser');
const apiKey = process.env.YELP_FUSION_API_KEY;
const client = Yelp.client(apiKey);

//get the array of the users favorites
const getFavorites = asyncHandler(async (req, res) => {
    const { userID } = req.body;

    let user;
    if (userID) {
        user = await User.findOne({ _id: userID });
    }

    if (!user) {
        const error = { error: { code: "USER_NOT_FOUND", description: "The user wasn't found provided the wrong userid..." } };
        res.status(400).json(error);
        throw new Error("user not found");
    }
    
    var favorites = user.favorite;
    var bisArray = [];

    async function fusionGetBusinessDetails(item) {
        let businessID = item;

        let response = await client.business(businessID);
        // console.log(response.jsonBody);
        return response.jsonBody;
    };


    for(i=0; i<favorites.length; i++)
    {
        let value = await fusionGetBusinessDetails(favorites[i]);
        // console.log("jsonRes:"+value);
        bisArray.push(value);
    }

    // console.log(bisArray);
    res.status(200).json(bisArray);
    
});





//add a businessID from a users favorite array
const addFavorite = asyncHandler(async (req, res) => {
    const { userID, businessID } = req.body;

    let user;
    if (userID) {
        user = await User.findOne({ _id: userID });
    }

    if (!user) {
        const error = { error: { code: "USER_NOT_FOUND", description: "The user wasn't found provided the wrong userid..." } };
        res.status(400).json(error);
        throw new Error("user not found");
    }

    //check if the user has already favorited this business
    if( user.favorite.indexOf(businessID) >= 0 )
    {
        const error = { error: { code: "ALREADY_FAVORITED", description: "The provided businessID is already in the users favorites" } };
        res.status(400).json(error);
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
        const error = { error: { code: "USER_NOT_FOUND", description: "The user wasn't found provided the wrong userid..." } };
        res.status(400).json(error);
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