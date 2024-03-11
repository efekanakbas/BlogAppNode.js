const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const { messageGET, messagePOST } = require("../controllers/message");

router.get('/messages', authenticateJWT, messageGET )
router.post('/messages', authenticateJWT, messagePOST )

module.exports = router;