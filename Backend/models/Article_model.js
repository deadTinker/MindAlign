const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 180 },
  excerpt: { type: String, trim: true, maxlength: 320, default: "" },
  content: { type: String, required: true, trim: true, maxlength: 30000 },
  category: { type: String, trim: true, default: "Personal Growth", maxlength: 60 },
  coverImage: { type: String, trim: true, default: "" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  likesCount: { type: Number, default: 0, min: 0, index: true },
  published: { type: Boolean, default: true, index: true }
}, { timestamps: true });

articleSchema.index({ createdAt: -1 });
articleSchema.index({ title: "text", content: "text", excerpt: "text" });

module.exports = mongoose.model("Article", articleSchema);
