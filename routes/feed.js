const express = require("express");
const { feedGET, feedPOST, feedOneGET, likePOST, unlikePOST } = require("../controllers/feed");
const router = express.Router();
const uploadMiddleware = require("../middleware/uploadMiddleware");
const authenticateJWT = require('../middleware/authenticateJWT');

router.get('/feeds', authenticateJWT , feedGET)
router.get('/feeds/:username', authenticateJWT, feedOneGET)
router.post('/feeds', authenticateJWT , uploadMiddleware,  feedPOST)
router.post('/like', authenticateJWT, likePOST)

module.exports = router;