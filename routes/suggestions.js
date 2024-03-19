const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const { suggestionsGET } = require("../controllers/suggestions");

router.get('/suggestions', authenticateJWT, suggestionsGET)

module.exports = router;