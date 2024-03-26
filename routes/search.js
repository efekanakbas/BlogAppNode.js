const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const {seacrhGET, searchDataGET} = require('../controllers/search.js')

router.get('/search', authenticateJWT, seacrhGET)
router.get('/searchData/:params', authenticateJWT, searchDataGET)

module.exports = router;