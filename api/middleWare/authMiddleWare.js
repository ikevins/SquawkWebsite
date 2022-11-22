const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');


const protect = asyncHandler(async (req, res, next) => {
    try {
        const { token } = req.headers; //grabes token from headers
        
        if (!token) {
            res.status(401);
            throw new Error("1)Not authorized, please login");
        }

        //verify the token with JWT_SECRET
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        //find userid from verified.id 
        const user = await User.findById(verified.id).select("-password");

        if (!user) {
            res.status(401);
            throw new Error("user not found");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401);
        throw new Error("2)Not authorized, please login");
    }
});

module.exports = protect;