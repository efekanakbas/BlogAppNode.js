const express = require("express");
const { feedGET, feedPOST, feedOneGET, likePOST, commentPOST, feedDELETE } = require("../controllers/feed");
const router = express.Router();
const uploadMiddleware = require("../middleware/uploadMiddleware");
const authenticateJWT = require('../middleware/authenticateJWT');

router.get('/feeds', authenticateJWT , feedGET)
router.get('/feeds/:username', authenticateJWT, feedOneGET)
router.post('/feeds', authenticateJWT , uploadMiddleware,  feedPOST)
router.post('/like', authenticateJWT, likePOST)
router.post('/comment', authenticateJWT, commentPOST)
router.delete('/feeds', authenticateJWT, feedDELETE)

module.exports = router;