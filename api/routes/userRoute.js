const express = require('express');
const { registerUser, loginUser, loginOut } = require('../controllers/userController');
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", loginOut);

module.exports = router;