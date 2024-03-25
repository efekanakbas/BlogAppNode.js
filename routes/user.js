const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const { detailsGET, locationPATCH, jobPATCH, skillsPATCH, experiencesPATCH, educationsPATCH, languagesPATCH, introPATCH, avatarPATCH, coverPATCH } = require("../controllers/user");
const uploadMiddleware = require("../middleware/uploadMiddleware");

router.get('/details/:username', authenticateJWT, detailsGET)
router.patch('/location', authenticateJWT, locationPATCH)
router.patch('/job', authenticateJWT, jobPATCH)
router.patch('/skills', authenticateJWT, skillsPATCH)
router.patch('/experiences', authenticateJWT, experiencesPATCH)
router.patch('/educations', authenticateJWT, educationsPATCH)
router.patch('/languages', authenticateJWT, languagesPATCH)
router.patch('/intro', authenticateJWT, introPATCH)
router.patch('/avatar', authenticateJWT, uploadMiddleware, avatarPATCH)
router.patch('/cover', authenticateJWT, uploadMiddleware, coverPATCH)

module.exports = router;