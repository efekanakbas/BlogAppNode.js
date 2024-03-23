const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const { detailsGET, locationPATCH, jobPATCH, skillsPATCH, experiencesPATCH, educationsPATCH, languagesPATCH, introPATCH } = require("../controllers/user");

router.get('/details/:username', authenticateJWT, detailsGET)
router.patch('/location', authenticateJWT, locationPATCH)
router.patch('/job', authenticateJWT, jobPATCH)
router.patch('/skills', authenticateJWT, skillsPATCH)
router.patch('/experiences', authenticateJWT, experiencesPATCH)
router.patch('/educations', authenticateJWT, educationsPATCH)
router.patch('/languages', authenticateJWT, languagesPATCH)
router.patch('/intro', authenticateJWT, introPATCH)

module.exports = router;