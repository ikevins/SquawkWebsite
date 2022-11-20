const express = require('express');
const { registerUser, loginUser, removeToken, getUserInfo, editUserInfo, deleteUser, changePassword, verifyEmail, emailVerificaionCode, passwordRecovery, deleteUserTest, changeEmailVerification, } = require('../controllers/userController');
const protect = require('../middleWare/authMiddleWare');
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/disabletoken", removeToken);
router.post("/getuser", getUserInfo);
router.post("/edituser", editUserInfo);
router.post("/deleteuser", deleteUser);
router.patch("/changepassword", changePassword);
router.post("/verifyemail", verifyEmail);
router.post("/sendrecoveryemail", emailVerificaionCode);
router.post("/resetpassword", passwordRecovery);
router.post("/deleteusertest", deleteUserTest); // used only for test cases
router.post("/changefalse", changeEmailVerification); // used only for test cases
module.exports = router;