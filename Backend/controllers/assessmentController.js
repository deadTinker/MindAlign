const Assessment = require("../models/Assessment");

const submitAssessment = async (req, res) => {
  try {
    const { answers, score, total } = req.body;

    if (
      !Array.isArray(answers) ||
      answers.length === 0 ||
      typeof score !== "number" ||
      typeof total !== "number"
    ) {
      return res.status(400).json({
        message: "Invalid assessment data",
      });
    }

    let riskLevel;

    if (score <= 20) {
      riskLevel = "Low";
    } else if (score <= 35) {
      riskLevel = "Moderate";
    } else {
      riskLevel = "High";
    }

    const assessment = await Assessment.create({
      userId: req.user,
      answers,
      score,
      total,
      riskLevel,
    });

    res.status(201).json({
      message: "Assessment submitted successfully",
      assessment,
    });
  } catch (error) {
    console.error("Assessment submission error:", error);

    res.status(500).json({
      message: "There was an error processing the assessment",
    });
  }
};

const getLatestAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findOne({
      userId: req.user,
    }).sort({ createdAt: -1 });

    if (!assessment) {
      return res.status(404).json({
        message: "No assessment found",
      });
    }

    res.status(200).json({
      assessment,
    });
  } catch (error) {
    console.error("Get assessment error:", error);

    res.status(500).json({
      message: "There was an error retrieving the assessment",
    });
  }
};

const getAssessmentHistory = async (req, res) => {
  try {
    const assessments = await Assessment.find({
      userId: req.user,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      assessments,
    });
  } catch (error) {
    console.error("Assessment history error:", error);

    res.status(500).json({
      message: "There was an error retrieving assessment history",
    });
  }
};

module.exports = {
  submitAssessment,
  getLatestAssessment,
  getAssessmentHistory,
};