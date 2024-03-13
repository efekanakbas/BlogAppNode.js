const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const { messageGET, messageRoomGET, messagePOST } = require("../controllers/message");

router.get('/messages', authenticateJWT, messageGET )
router.get('/messages/:id', authenticateJWT, messageRoomGET )
router.post('/messages', authenticateJWT, messagePOST )

module.exports = router;