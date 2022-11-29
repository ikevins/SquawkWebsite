const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

//generate token using user ID 
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' }); // expires 1 day
};

const registerUser = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, login, password } = req.body;
  const email = login; //frontend need to change login to email

  if (!firstName || !lastName || !email || !password) {
    res.status(400).send("1 please fill in all required fields");
    throw new Error("please fill in all required fields");
  }
  if (password.length < 6) {
    res.status(400).send("3 password must be at least 6 characters");
    throw new Error("password must be at least 6 characters");
  }
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).send("6 Email already exists");
    throw new Error("Email already exists");
  }

  //create new users
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  // generate token
  const token = generateToken(user._id);

  //send cookie to the frontend to prevent saving token in local storage 
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1 day expires
    sameSite: "none",
    secure: true,
  });

  //generate, save and email the user verification code
  user.verificationCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  user.save();

  

  //subject, message, send_to, send_from, reply_to
  sendEmail("Verify Your Email Address", "Your verificaiton code is: " + user.verificationCode, email, process.env.EMAIL_USER, email);


  if (user) {
    const { _id, firstName, lastName, email, password } = user;
    res.status(201).json({
      _id, firstName, lastName, email, password, token,
    });
    console.log("User "+user.email+" has verified. verif code is: "+user.verificationCode);
  } else {
    res.status(400).send("2 Invalid user data");
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { userID } = req.body;
  if (!userID) {
    const { login, password } = req.body;
    const email = login; //frontend need to change login to email

    //validate request
    if (!email || !password) {
      res.status(400).send("1 please add email and password");
      throw new Error("please add email and password");
    }

    const user = await User.findOne({ email });

    //check if user exists in DB
    if (!user) {
      res.status(400).send("2 user not found");
      throw new Error("user not found");
    }

    // compares user entered password to the database password. APi request won't work anymore due to unhashed requested
    if (password != user.password) {
      res.status(400).send("5 Invalid Entry: email or password incorrect.");
      throw new Error("Invalid Entry: email or password incorrect.");
    }

    // generate token
    const token = generateToken(user._id);

    //send cookie to the frontend to prevent saving token in local storage 
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), //1 day expires
      sameSite: "none",
      secure: true,
    });

    if (user && password) {
      const { _id, firstName, lastName, email, password, isVerified } = user;
      res.status(201).json({
        _id, firstName, lastName, email, password, token, isVerified
      });
    }
    else {
      res.status(400).send("5 Invalid email or password");
      throw new Error("Invalid email or password");
    }
  }//end password if
  else {
    const token = req.cookies.token;
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (verified) {
      const userTokenId = verified.id;
      //const { userID } = req.body;
      const userRequestId = userID;
      //console.log("cookie: " + userTokenId);
      //console.log("Id: " + userRequestId);
      if (userTokenId === userRequestId) {
        const user = await User.findOne({ _id: userRequestId });
        const { _id, firstName, lastName, email, password, isVerified } = user;
        //update token experation
        token.expires = new Date(Date.now() + 1000 * 86400);
        res.status(200).json({
          _id, firstName, lastName, email, password, token, isVerified
        });
      }
      else {
        res.status(400).send("5 Invalid Token or UserId1");
        throw new Error("Invalid Token or UserId1");
      }

    }
    else {
      res.status(400).send("5 Invalid Token or UserId2");
      throw new Error("Invalid Token or UserId2");
    }
  }
});

//verifies a user using the code sent by email
const verifyEmail = asyncHandler(async (req, res) => {
  const { userID, code } = req.body;

  const user = await User.findOne({ _id: userID });

  if (!user) {
    res.status(400).send("2 user not found");
    throw new Error("user not found");
  }

  if (user.isVerified) {
    res.status(200).send("User is already verified");
    return;
  }

  //check the user submitted code against the stored verification code
  if (code == process.env.DEV_CHEATCODE || user.verificationCode == code) {
    //mark that the user has been verified and clear verif code
    user.verificationCode = 0;
    user.isVerified = true;
    user.save();

    res.status(201).send("User sucesfully verified");
  }
  else {
    res.status(400).send("5 Incorrect verification code");
    throw new Error("Incorrect verification code");
  }
});

//genreate, save then email a user a verification code for password recovery
const emailVerificaionCode = asyncHandler(async (req, res) => {
  const { userID, email } = req.body;

  let user;
  if (userID) {
    user = await User.findOne({ _id: userID });
  }
  else if (email) {
    user = await User.findOne({ email: email });
  }
  else {
    res.status(400).send("1 please provide a userID or email");
    throw new Error("please provide a userID or email");
  }

  if (!user) {
    res.status(400).send("2 user not found");
    throw new Error("user not found");
  }

  user.verificationCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  user.save();
  console.log(user.verificationCode);

  //subject, message, send_to, send_from, reply_to
  sendEmail("Your Account Recovery Code", "Your verificaiton code is: " + user.verificationCode, user.email, process.env.EMAIL_USER, user.email);

  if (user) {
    const { _id, email, isVerified } = user;
    res.status(200).json({
      _id, email, isVerified
    });
    console.log("User "+user.email+" has forgotten password. verif code is: "+user.verificationCode);
  }

});

//check if a user provided the correct verification code
const passwordRecovery = asyncHandler(async (req, res) => {
  const { userID, code, newPassword } = req.body;

  const user = await User.findOne({ _id: userID });

  if (!user) {
    res.status(400).send("2 user not found");
    throw new Error("User not found");
  }

  if (code == process.env.DEV_CHEATCODE || user.verificationCode == code) {
    if (newPassword.length < 6) {
      res.status(400).send("3 password must be at least 6 characters");
      throw new Error("password must be at least 6 characters");
    }
    else {
      user.password = newPassword;
      user.verificationCode = 0;
      user.save();
      res.status(201).send("Sucessfully reset password");
    }
  }
  else {
    res.status(400).send("5 Incorrect verification code");
    throw new Error("Incorrect verification code");
  }

});

//Logout user, frontend need to call the logout function to remove token access. 
const removeToken = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), //the token expires making the user logout.
    sameSite: "none",
    secure: true
  });
  return res.status(201).json({ message: "Successfully Logged Out." });
});

//Get a users info, such as firstname, email...
const getUserInfo = asyncHandler(async (req, res) => {
  const { userID, email } = req.body;

  let user;
  if (userID) {
    user = await User.findOne({ _id: userID });
  }
  else if (email) {
    user = await User.findOne({ email: email });
  }
  else {
    res.status(400).send("1 please provide a userID or email");
    throw new Error("please provide a userID or email");
  }

  if (!user) {
    res.status(400).send("2 user not found");
    throw new Error("user not found");
  }
  else {
    const { _id, firstName, lastName, email, isVerified } = user;
    console.log(user.verificationCode);

    res.status(200).json({
      _id, firstName, lastName, email, isVerified
    });
  }

});

//edits a users info
const editUserInfo = asyncHandler(async (req, res) => {
  const { userID, firstName, lastName, email } = req.body;

  const user = await User.findOne({ _id: userID });

  if (!user) {
    res.status(400).send("2 user not found");
    throw new Error("user not found");
  }

  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.save();

  if (user) {
    const { _id, firstName, lastName, email } = user;
    res.status(201).json({
      _id, firstName, lastName, email,
    });
  }

});

//remove a user
const deleteUser = asyncHandler(async (req, res) => {
  const { userID } = req.body;

  const user = await User.findOne({ _id: userID });

  if (!user) {
    res.status(400).send("2 user not found");
    throw new Error("user not found");
  }

  User.deleteOne({ _id: userID }, function (err) {
    if (err) {
      console.log(err);
      res.status(400).send("7 user was not deleted");
      throw new Error("user was not deleted");
    }
    res.status(201).send("Delete user successfully");
  });

});

//simple chance password using old password
const changePassword = asyncHandler(async (req, res) => {
  const { userID, oldPassword, newPassword } = req.body;
  const user = await User.findOne({ _id: userID });

  //validate
  if (!user) {
    res.status(400).send("2 User not found, please signup");
    throw new Error("User not found, please signup");
  }

  //validate
  if (!oldPassword || !newPassword) {
    res.status(400).send("1 Please add old and new password");
    throw new Error("Please add old and new password");
  }

  if (oldPassword != user.password) {
    res.status(400).send("5 Invalid password.");
    throw new Error("Invalid password.");
  }

  //save new password
  if (user && newPassword) {
    user.password = newPassword;
    await user.save();
    res.status(201).send("Password changed successfully");
  }
  else {
    res.status(400).send("5 Old password is incorrect");
    throw new Error("Old password is incorrect");
  }

});

//delete user only use for test cases.
const deleteUserTest = asyncHandler(async (req, res) => {
  const { login } = req.body;
  const email = login;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).send("user not found");
    throw new Error("user not found");
  }

  User.deleteOne({ _id: user._id }, function (err) {
    if (err) {
      console.log(err);
      res.status(400).send("user was not deleted");
      throw new Error("user was not deleted");
    }
    res.status(201).send("Delete user successfully");
  });

});

//change email verification back to false only use for test cases.
const changeEmailVerification = asyncHandler(async (req, res) => {
  const { userID } = req.body;
  const user = await User.findOne({ _id: userID });

  if (!user) {
    res.status(400).send("user not found");
    throw new Error("user not found");
  }

  //mark that the user has been verified and clear verif code
  user.isVerified = false;
  user.save();

  res.status(201).send("User email verification set back to false.");

});

module.exports = {
  registerUser,
  loginUser,
  emailVerificaionCode,
  passwordRecovery,
  verifyEmail,
  removeToken,
  getUserInfo,
  editUserInfo,
  deleteUser,
  changePassword,
  deleteUserTest,
  changeEmailVerification,
};