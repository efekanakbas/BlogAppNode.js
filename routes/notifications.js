const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');

router.get('/notifications', authenticateJWT)

module.exports = router;