const Assessment = require("../models/Assessment_model");

const submitAssessment = async (req, res) => {
  try {
    const { answers, features, textResponses } = req.body;

    // Validate structured assessment
    if (
      !Array.isArray(answers) ||
      answers.length === 0 ||
      !Array.isArray(features) ||
      features.length === 0
    ) {
      return res.status(400).json({
        message: "Invalid assessment data",
      });
    }

    // Validate text responses
    if (
      !Array.isArray(textResponses) ||
      textResponses.length === 0
    ) {
      return res.status(400).json({
        message: "Text responses are required",
      });
    }

    // --------------------------------
    // 1. Send text responses to NLP
    // --------------------------------

    const nlpResponse = await fetch(
      "http://127.0.0.1:5001/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          responses: textResponses,
        }),
      }
    );

    if (!nlpResponse.ok) {
      throw new Error("NLP API failed");
    }

    const nlpScores = await nlpResponse.json();

    console.log("NLP scores:", nlpScores);

    // --------------------------------
    // 2. Convert frontend features
    //    into an object for ML
    // --------------------------------

    const featureObject = {};

    features.forEach((item) => {
      featureObject[item.feature] = item.value;
    });

    // Add NLP results
    featureObject.stress_level = nlpScores.stress;
    featureObject.anxiety_score = nlpScores.anxiety;
    featureObject.depression_score = nlpScores.depression;

    console.log("ML features:", featureObject);

    // --------------------------------
    // 3. Send everything to ML API
    // --------------------------------

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

    // --------------------------------
    // 4. Save final assessment
    // --------------------------------

    const score = answers.reduce(
      (total, answer) => total + answer,
      0
    );

    const total = answers.length * 5;

    const assessment = await Assessment.create({
      userId: req.user,
      answers,
      features,
      score,
      total,

      nlpScores: {
        stress: nlpScores.stress,
        anxiety: nlpScores.anxiety,
        depression: nlpScores.depression,
      },

      burnoutProbability: mlResult.burnoutProbability,

      riskLevel: mlResult.riskLevel,
    });

    // --------------------------------
    // 5. Send result to frontend
    // --------------------------------

    res.status(201).json({
      message: "Assessment analyzed successfully",

      assessment,
    });

  } catch (error) {
    console.error(
      "Assessment submission error:",
      error
    );

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
    console.error(
      "Get assessment error:",
      error
    );

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
    console.error(
      "Assessment history error:",
      error
    );

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