const express = require("express");
const { registerPOST, loginPOST } = require("../controllers/auth");
const router = express.Router();

router.post("/register", registerPOST);
router.post("/login", loginPOST);

module.exports = router;
