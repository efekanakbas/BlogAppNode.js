const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const { notifGET } = require("../controllers/notifications");

router.get('/notifications', authenticateJWT, notifGET)

module.exports = router;