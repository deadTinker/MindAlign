const express = require("express");

const {
  submitAssessment,
  getLatestAssessment,
  getAssessmentHistory,
} = require("../controllers/assessmentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, submitAssessment);

router.get("/latest", authMiddleware, getLatestAssessment);

router.get("/history", authMiddleware, getAssessmentHistory);

module.exports = router;