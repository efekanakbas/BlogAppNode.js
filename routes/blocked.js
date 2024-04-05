const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const {blockedPOST, blockedGET, unBlockedPOST} = require("../controllers/blocked.js")

router.get('/blocked', authenticateJWT, blockedGET)
router.post('/blocked', authenticateJWT, blockedPOST)
router.post('/unblocked', authenticateJWT, unBlockedPOST)

module.exports = router;