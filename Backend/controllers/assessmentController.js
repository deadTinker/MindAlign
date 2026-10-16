const Assessment = require("../models/Assessment_model");

const submitAssessment = async (req, res) => {
  let assessment;

  try {
    const {
      answers,
      features,
      textResponses,
      retakeAssessment,
    } = req.body;

    const hasOptionAssessment =
      Array.isArray(answers) &&
      answers.length > 0 &&
      Array.isArray(features) &&
      features.length > 0;

    const hasTextAssessment =
      Array.isArray(textResponses) &&
      textResponses.length > 0 &&
      textResponses.some(
        (response) =>
          typeof response === "string" &&
          response.trim().length > 0
      );

    if (!hasOptionAssessment && !hasTextAssessment) {
      return res.status(400).json({
        message: "Please submit a valid assessment.",
      });
    }

    if (
      hasOptionAssessment &&
      (!answers.every(Number.isFinite) ||
        !features.every(
          (item) =>
            item &&
            typeof item.feature === "string" &&
            Number.isFinite(item.value)
        ))
    ) {
      return res.status(400).json({
        message: "Invalid option-based assessment data.",
      });
    }

    if (
      hasTextAssessment &&
      !textResponses.every(
        (response) => typeof response === "string"
      )
    ) {
      return res.status(400).json({
        message: "Invalid text-based assessment data.",
      });
    }

    // Find the current incomplete assessment cycle.
    assessment = await Assessment.findOne({
      userId: req.user,
      optionAssessmentCompleted: { $exists: true },
      textAssessmentCompleted: { $exists: true },
      $or: [
        { optionAssessmentCompleted: false },
        { textAssessmentCompleted: false },
        { riskLevel: "Pending" },
      ],
    }).sort({ updatedAt: -1 });

    // Create a new assessment cycle if necessary.
    if (!assessment) {
      assessment = new Assessment({
        userId: req.user,
        optionAssessmentCompleted: false,
        textAssessmentCompleted: false,
        riskLevel: "Pending",
      });
    } else if (retakeAssessment === true) {
      // Retaking either test invalidates the previous combined result.
      // Both assessments must be completed again.
      assessment.optionAssessmentCompleted = false;
      assessment.textAssessmentCompleted = false;

      assessment.answers = undefined;
      assessment.features = undefined;
      assessment.textResponses = undefined;

      assessment.score = null;
      assessment.total = null;

      assessment.nlpScores = {
        stress: null,
        anxiety: null,
        depression: null,
      };

      assessment.burnoutProbability = null;
      assessment.riskLevel = "Pending";
    }

    // Save the option-based assessment.
    if (hasOptionAssessment) {
      if (assessment.optionAssessmentCompleted) {
        return res.status(409).json({
          message:
            "The option-based assessment is already completed. Use Retake Assessment to replace it.",
        });
      }

      assessment.answers = answers;
      assessment.features = features;

      assessment.score = answers.reduce(
        (sum, answer) => sum + answer,
        0
      );

      assessment.total = answers.length * 5;
      assessment.optionAssessmentCompleted = true;
    }

    // Save the text-based assessment.
    if (hasTextAssessment) {
      if (assessment.textAssessmentCompleted) {
        return res.status(409).json({
          message:
            "The text-based assessment is already completed. Use Retake Assessment to replace it.",
        });
      }

      assessment.textResponses = textResponses;
      assessment.textAssessmentCompleted = true;
    }

    // Save progress before analysis.
    await assessment.save();

    // Do not generate results until both assessments are complete.
    if (
      !assessment.optionAssessmentCompleted ||
      !assessment.textAssessmentCompleted
    ) {
      const missingAssessment =
        !assessment.optionAssessmentCompleted
          ? "option"
          : "text";

      return res.status(200).json({
        message:
          "Assessment saved. Complete the other assessment to receive your results.",
        completed: false,
        missingAssessment,
        assessment,
      });
    }

    // 1. Analyze text responses using NLP.
    const nlpResponse = await fetch(
      "http://127.0.0.1:5001/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          responses: assessment.textResponses,
        }),
      }
    );

    if (!nlpResponse.ok) {
      throw new Error("NLP API failed");
    }

    const nlpScores = await nlpResponse.json();

    console.log("NLP scores:", nlpScores);

    // 2. Combine structured features with NLP scores.
    const featureObject = {};

    assessment.features.forEach((item) => {
      featureObject[item.feature] = item.value;
    });

    featureObject.stress_level = nlpScores.stress;
    featureObject.anxiety_score = nlpScores.anxiety;
    featureObject.depression_score = nlpScores.depression;

    console.log("ML features:", featureObject);

    // 3. Generate the final result using the ML API.
    const mlResponse = await fetch(
      "http://127.0.0.1:5002/predict",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          features: featureObject,
        }),
      }
    );

    if (!mlResponse.ok) {
      throw new Error("ML API failed");
    }

    const mlResult = await mlResponse.json();

    console.log("ML result:", mlResult);

    // 4. Save the final analysis.
    assessment.nlpScores = {
      stress: nlpScores.stress,
      anxiety: nlpScores.anxiety,
      depression: nlpScores.depression,
    };

    assessment.burnoutProbability =
      mlResult.burnoutProbability;

    assessment.riskLevel = mlResult.riskLevel;

    await assessment.save();

    // 5. Return the final result.
    return res.status(200).json({
      message: "Both assessments analyzed successfully.",
      completed: true,
      assessment,
    });
  } catch (error) {
    console.error("Assessment submission error:", error);

    return res.status(500).json({
      message:
        "Your assessment was saved where possible, but analysis failed. Please try again.",
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
