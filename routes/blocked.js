const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const {blockedPOST, blockedGET} = require("../controllers/blocked.js")

router.get('/blocked', authenticateJWT, blockedGET)
router.post('/blocked', authenticateJWT, blockedPOST)

module.exports = router;