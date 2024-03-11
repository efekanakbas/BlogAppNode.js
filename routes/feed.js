const express = require("express");
const { feedGET, feedPOST } = require("../controllers/feed");
const router = express.Router();
const uploadMiddleware = require("../middleware/uploadMiddleware");
const authenticateJWT = require('../middleware/authenticateJWT');

router.get('/feeds', authenticateJWT , feedGET)
router.post('/feeds', authenticateJWT ,  feedPOST)

module.exports = router;