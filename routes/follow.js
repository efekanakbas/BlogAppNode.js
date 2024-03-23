const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const { followPOST, unFollowPOST } = require("../controllers/follow");

router.post('/follow', authenticateJWT, followPOST)
router.post('/unfollow', authenticateJWT, unFollowPOST)

module.exports = router;