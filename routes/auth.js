const express = require("express");
const { registerPOST, loginPOST, logoutGET, isLoggedGET, emailPATCH, passwordPATCH } = require("../controllers/auth");
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');

router.post("/register", registerPOST);
router.post("/login", loginPOST);
router.get('/logout', authenticateJWT , logoutGET)
router.get('/islogged', authenticateJWT , isLoggedGET)
router.patch('/email', authenticateJWT, emailPATCH)
router.patch('/password', authenticateJWT, passwordPATCH)

module.exports = router;
