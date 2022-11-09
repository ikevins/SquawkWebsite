const express = require('express');
const { registerUser, loginUser, logOut } = require('../controllers/userController');
const protect = require('../middleWare/authMiddleWare');
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logOut);

module.exports = router;