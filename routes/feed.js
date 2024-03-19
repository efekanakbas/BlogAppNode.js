const express = require("express");
const { feedGET, feedPOST, feedOneGET } = require("../controllers/feed");
const router = express.Router();
const uploadMiddleware = require("../middleware/uploadMiddleware");
const authenticateJWT = require('../middleware/authenticateJWT');

router.get('/feeds', authenticateJWT , feedGET)
router.get('/feeds/:id', authenticateJWT, feedOneGET)
router.post('/feeds', authenticateJWT , uploadMiddleware,  feedPOST)

module.exports = router;