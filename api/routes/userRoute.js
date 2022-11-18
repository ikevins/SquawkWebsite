const express = require('express');
const { registerUser, loginUser, removeToken, getUserInfo, editUserInfo, deleteUser, changePassword, verifyEmail, emailVerificaionCode, passwordRecovery } = require('../controllers/userController');
const protect = require('../middleWare/authMiddleWare');
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/disabletoken", removeToken);
router.get("/getuser", getUserInfo);
router.post("/edituser", editUserInfo);
router.post("/deleteuser", deleteUser);
router.patch("/changepassword", changePassword);
router.post("/verifyemail", verifyEmail);
router.post("/sendrecoveryemail", emailVerificaionCode);
router.post("/resetpassword", passwordRecovery);

module.exports = router;