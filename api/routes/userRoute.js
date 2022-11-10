const express = require('express');
const { registerUser, loginUser, logOut, getUserInfo, editUserInfo, deleteUser,changePassword } = require('../controllers/userController');
const protect = require('../middleWare/authMiddleWare');
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logOut);
router.get("/getUser", getUserInfo);
router.post("/editUser", editUserInfo);
router.post("/deleteUser", deleteUser);
router.patch("/changepassword", changePassword);

module.exports = router;