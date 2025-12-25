const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");
const { validateFormSubmission } = require("../middleware/validation");

// User routes (protected)
router.post("/submit", authenticateToken, validateFormSubmission, applicationController.submitApplication);
router.get("/my-applications", authenticateToken, applicationController.getUserApplications);

// Admin routes (protected)
router.get("/form/:formId", authenticateToken, authorizeAdmin, applicationController.getApplicationsByForm);
router.get("/form/:formId/stats", authenticateToken, authorizeAdmin, applicationController.getApplicationStats);
router.get("/:applicationId", authenticateToken, applicationController.getApplicationById);

module.exports = router;
