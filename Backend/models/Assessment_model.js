const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answers: {
      type: [Number],
      required: true,
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
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
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