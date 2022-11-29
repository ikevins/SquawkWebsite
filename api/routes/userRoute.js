const express = require('express');
const { registerUser, loginUser, removeToken, getUserInfo, editUserInfo, deleteUser, changePassword, verifyEmail, emailVerificaionCode, passwordRecovery, deleteUserTest, changeEmailVerification, } = require('../controllers/userController');
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/reviewController');
const protect = require('../middleWare/authMiddleWare');
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/disabletoken", removeToken);
router.post("/getuser", protect, getUserInfo);
router.post("/edituser", protect, editUserInfo);
router.post("/deleteuser", protect, deleteUser);
router.patch("/changepassword", protect, changePassword);
router.post("/verifyemail", verifyEmail);
router.post("/sendrecoveryemail", emailVerificaionCode);
router.post("/resetpassword", passwordRecovery);
router.post("/deleteusertest", deleteUserTest); // used only for test cases
router.post("/changefalse", changeEmailVerification); // used only for test cases

router.post("/getfavorites", protect, getFavorites);
router.post("/addfavorite", protect, addFavorite);
router.post("/removefavorite", protect, removeFavorite);

module.exports = router;