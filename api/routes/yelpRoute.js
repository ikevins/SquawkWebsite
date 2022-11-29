const express = require('express');
const {fusionSearch, fusionGetBusinessDetails} = require('../controllers/yelpController');
const protect = require('../middleWare/authMiddleWare');
const router = express.Router();

router.get("/search", fusionSearch);
router.get("/businessinfo", fusionGetBusinessDetails);


module.exports = router;