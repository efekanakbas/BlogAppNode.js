const express = require("express");
const { registerPOST, loginPOST, logoutGET, isLoggedGET } = require("../controllers/auth");
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');

router.post("/register", registerPOST);
router.post("/login", loginPOST);
router.get('/logout', authenticateJWT , logoutGET)
router.get('/islogged', authenticateJWT , isLoggedGET)

module.exports = router;
