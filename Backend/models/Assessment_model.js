const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Option-based assessment
    answers: {
      type: [Number],
      default: undefined,
    },

    features: {
      type: [
        {
          feature: {
            type: String,
            required: true,
          },
          value: {
            type: Number,
            required: true,
          },
        },
      ],
      default: undefined,
    },

    // Text-based assessment
    textResponses: {
      type: [String],
      default: undefined,
    },

    // Track completion of each assessment
    optionAssessmentCompleted: {
      type: Boolean,
      default: false,
    },

    textAssessmentCompleted: {
      type: Boolean,
      default: false,
    },

    // Final assessment score
    score: {
      type: Number,
      default: null,
    },

    total: {
      type: Number,
      default: null,
    },

    nlpScores: {
      stress: {
        type: Number,
        default: null,
      },
      anxiety: {
        type: Number,
        default: null,
      },
      depression: {
        type: Number,
        default: null,
      },
    },

    burnoutProbability: {
      type: Number,
      default: null,
    },

    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High", "Pending"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Assessment", assessmentSchema);
