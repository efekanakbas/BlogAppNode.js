const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const { detailsGET } = require("../controllers/user");

router.get('/details/:username', authenticateJWT, detailsGET)

module.exports = router;