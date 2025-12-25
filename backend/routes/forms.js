const express = require("express");
const router = express.Router();
const formController = require("../controllers/formController");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");
const { validateQuestion } = require("../middleware/validation");

// Get all forms (public)
router.get("/", formController.getForms);

// Get specific form with questions (public)
router.get("/:formId", formController.getFormById);

// Admin routes (protected)
router.post("/", authenticateToken, authorizeAdmin, formController.createForm);
router.post("/:formId/questions", authenticateToken, authorizeAdmin, validateQuestion, formController.addQuestion);
router.put("/:formId/publish", authenticateToken, authorizeAdmin, formController.publishForm);
router.delete("/:formId", authenticateToken, authorizeAdmin, formController.deleteForm);

module.exports = router;
