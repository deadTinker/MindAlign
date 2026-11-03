const Assessment = require("../models/Assessment_model");

// Each question is scored according to its actual answer range.
// All resulting scores represent burnout-related concern:
// 0 = lower concern, 100 = higher concern.
const calculateQuestionnaireScore = (features) => {
  const scoringRules = {
    study_hours_per_day: {
      min: 1,
      max: 9,
      reverse: false,
    },
    exam_pressure: {
      min: 1,
      max: 10,
      reverse: false,
    },
    academic_performance: {
      min: 55,
      max: 87,
      reverse: true,
    },
    sleep_hours: {
      min: 3.5,
      max: 9,
      reverse: false,
    },
    physical_activity: {
      min: 0,
      max: 7,
      reverse: true,
    },
    social_support: {
      min: 1,
      max: 10,
      reverse: true,
    },
    screen_time: {
      min: 1.5,
      max: 9,
      reverse: false,
    },
    internet_usage: {
      min: 1.5,
      max: 9,
      reverse: false,
    },
    financial_stress: {
      min: 0,
      max: 10,
      reverse: false,
    },
    family_expectation: {
      min: 0,
      max: 10,
      reverse: false,
    },
  };

  const values = {};

  features.forEach(({ feature, value }) => {
    if (!scoringRules[feature]) {
      throw new Error(`Unknown assessment feature: ${feature}`);
    }

    if (values[feature] !== undefined) {
      throw new Error(`Duplicate assessment feature: ${feature}`);
    }

    const rule = scoringRules[feature];

    if (value < rule.min || value > rule.max) {
      throw new Error(`Invalid value for ${feature}`);
    }

    values[feature] = value;
  });

  const expectedFeatures = Object.keys(scoringRules);

  if (
    features.length !== expectedFeatures.length ||
    expectedFeatures.some((feature) => values[feature] === undefined)
  ) {
    throw new Error("All 10 assessment questions are required.");
  }

  const normalize = (value, min, max) =>
    ((value - min) / (max - min)) * 100;

  const questionScores = expectedFeatures.map((feature) => {
    const value = values[feature];
    const rule = scoringRules[feature];

    // Sleep uses an optimal range rather than assuming
    // that more sleep always means less concern.
    if (feature === "sleep_hours") {
      if (value >= 6 && value <= 8) {
        return 0;
      }

      if (value < 6) {
        return ((6 - value) / (6 - 3.5)) * 100;
      }

      return ((value - 8) / (9 - 8)) * 25;
    }

    let score = normalize(value, rule.min, rule.max);

    if (rule.reverse) {
      score = 100 - score;
    }

    return score;
  });

  const average =
    questionScores.reduce((sum, score) => sum + score, 0) /
    questionScores.length;

  return Number(average.toFixed(2));
};

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
      assessment.optionAssessmentCompleted = false;
      assessment.textAssessmentCompleted = false;

      assessment.answers = undefined;
      assessment.features = undefined;
      assessment.textResponses = undefined;

      assessment.score = null;
      assessment.total = null;

      assessment.questionnaireScore = null;
      assessment.questionnaireTotal = null;

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

      // Keep original answers and features unchanged.
      assessment.answers = answers;
      assessment.features = features;

      // Legacy raw score fields retained for compatibility.
      assessment.score = answers.reduce(
        (sum, answer) => sum + answer,
        0
      );

      assessment.total = answers.length * 5;

      // New normalized questionnaire concern index.
      assessment.questionnaireScore =
        calculateQuestionnaireScore(features);

      assessment.questionnaireTotal = 100;

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
    // Original feature values are passed to ML unchanged.
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

    // 4. Save the final analysis separately.
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
