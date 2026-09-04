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

    score: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    riskLevel: {
      type: String,
      enum: ["Low", "Moderate", "High"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Assessment", assessmentSchema);