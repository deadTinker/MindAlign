const mongoose = require("mongoose");
const Article = require("../models/Article_model");
const Comment = require("../models/Comment_model");
const User = require("../models/User_model");

const authorFields = "name profilePhoto.url";
const validId = (id) => mongoose.Types.ObjectId.isValid(String(id));
const authorPayload = (author) => author ? {
  id: author._id,
  name: author.name || "MindAlign member",
  avatar: author.profilePhoto?.url || ""
} : null;

const articlePayload = (article, userId, commentCount = 0) => ({
  id: article._id,
  title: article.title,
  excerpt: article.excerpt,
  content: article.content,
  category: article.category,
  coverImage: article.coverImage,
  author: authorPayload(article.author),
  isAuthor: String(article.author?._id || article.author) === String(userId),
  likesCount: article.likesCount ?? article.likes?.length ?? 0,
  commentsCount: commentCount,
  likedByMe: article.likes?.some((id) => String(id) === String(userId)) || false,
  createdAt: article.createdAt,
  updatedAt: article.updatedAt
});

const commentPayload = (comment, userId) => ({
  id: comment._id,
  content: comment.content,
  author: authorPayload(comment.author),
  isAuthor: String(comment.author?._id || comment.author) === String(userId),
  createdAt: comment.createdAt,
  likesCount: comment.likes?.length || 0,
  likedByMe: comment.likes?.some((id) => String(id) === String(userId)) || false
});

exports.listArticles = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(20, Math.max(1, Number.parseInt(req.query.limit, 10) || 10));
    const search = String(req.query.search || "").trim().slice(0, 100);
    const category = String(req.query.category || "").trim();
    const filter = { published: true };
    if (category && category !== "All" && category !== "All topics") filter.category = category;
    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { excerpt: { $regex: safeSearch, $options: "i" } },
        { content: { $regex: safeSearch, $options: "i" } }
      ];
    }
    const sort = req.query.sort === "popular" ? { likesCount: -1, createdAt: -1 } : { createdAt: -1 };
    const [articles, total] = await Promise.all([
      Article.find(filter).populate("author", authorFields).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
      Article.countDocuments(filter)
    ]);
    const ids = articles.map((item) => item._id);
    const counts = ids.length ? await Comment.aggregate([
      { $match: { article: { $in: ids } } },
      { $group: { _id: "$article", count: { $sum: 1 } } }
    ]) : [];
    const countMap = new Map(counts.map((item) => [String(item._id), item.count]));
    res.json({ articles: articles.map((item) => articlePayload(item, req.user, countMap.get(String(item._id)) || 0)), page, limit, total, hasMore: page * limit < total });
  } catch (error) {
    console.error("Community feed error:", error);
    res.status(500).json({ message: "Could not load community articles." });
  }
};

exports.getArticle = async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid article ID." });
    const article = await Article.findOne({ _id: req.params.id, published: true }).populate("author", authorFields);
    if (!article) return res.status(404).json({ message: "Article not found." });
    const roots = await Comment.find({ article: article._id, parent: null }).populate("author", authorFields).sort({ createdAt: 1 }).lean();
    const rootIds = roots.map((item) => item._id);
    const replies = rootIds.length ? await Comment.find({ parent: { $in: rootIds } }).populate("author", authorFields).sort({ createdAt: 1 }).lean() : [];
    const replyMap = new Map();
    replies.forEach((reply) => {
      const key = String(reply.parent);
      if (!replyMap.has(key)) replyMap.set(key, []);
      replyMap.get(key).push(commentPayload(reply, req.user));
    });
    const comments = roots.map((comment) => ({ ...commentPayload(comment, req.user), replies: replyMap.get(String(comment._id)) || [] }));
    res.json({ article: articlePayload(article, req.user, roots.length + replies.length), comments });
  } catch (error) {
    console.error("Article detail error:", error);
    res.status(500).json({ message: "Could not load this article." });
  }
};

exports.createArticle = async (req, res) => {
  try {
    const title = String(req.body.title || "").trim();
    const content = String(req.body.content || "").trim();
    const category = String(req.body.category || "Personal Growth").trim();
    const coverImage = String(req.body.coverImage || "").trim();
    if (title.length < 4 || title.length > 180) return res.status(400).json({ message: "Title must be between 4 and 180 characters." });
    if (content.length < 30 || content.length > 30000) return res.status(400).json({ message: "Article must be between 30 and 30,000 characters." });
    if (coverImage && !/^https:\/\//i.test(coverImage)) return res.status(400).json({ message: "Cover image must use a secure HTTPS URL." });
    const excerpt = String(req.body.excerpt || content.replace(/\s+/g, " ").slice(0, 220)).trim().slice(0, 320);
    const article = await Article.create({ author: req.user, title, content, excerpt, category: category.slice(0, 60), coverImage });
    await article.populate("author", authorFields);
    res.status(201).json({ article: articlePayload(article, req.user, 0) });
  } catch (error) {
    console.error("Create article error:", error);
    res.status(500).json({ message: "Could not publish article." });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid article ID." });
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found." });
    if (String(article.author) !== String(req.user)) return res.status(403).json({ message: "You can only edit your own articles." });
    const title = String(req.body.title ?? article.title).trim();
    const content = String(req.body.content ?? article.content).trim();
    const category = String(req.body.category ?? article.category).trim();
    const coverImage = String(req.body.coverImage ?? article.coverImage).trim();
    if (title.length < 4 || title.length > 180 || content.length < 30 || content.length > 30000) return res.status(400).json({ message: "Check the title and article length." });
    if (coverImage && !/^https:\/\//i.test(coverImage)) return res.status(400).json({ message: "Cover image must use a secure HTTPS URL." });
    article.title = title; article.content = content;
    article.excerpt = String(req.body.excerpt ?? content.replace(/\s+/g, " ").slice(0, 220)).trim().slice(0, 320);
    article.category = category.slice(0, 60); article.coverImage = coverImage;
    await article.save(); await article.populate("author", authorFields);
    const commentCount = await Comment.countDocuments({ article: article._id });
    res.json({ article: articlePayload(article, req.user, commentCount) });
  } catch (error) {
    console.error("Update article error:", error);
    res.status(500).json({ message: "Could not update article." });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid article ID." });
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found." });
    if (String(article.author) !== String(req.user)) return res.status(403).json({ message: "You can only delete your own articles." });
    await Promise.all([article.deleteOne(), Comment.deleteMany({ article: article._id })]);
    res.json({ message: "Article deleted." });
  } catch (error) {
    console.error("Delete article error:", error);
    res.status(500).json({ message: "Could not delete article." });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid article ID." });
    const article = await Article.findOne({ _id: req.params.id, published: true });
    if (!article) return res.status(404).json({ message: "Article not found." });
    const alreadyLiked = article.likes.some((id) => String(id) === String(req.user));
    if (alreadyLiked) article.likes.pull(req.user); else article.likes.addToSet(req.user);
    article.likesCount = article.likes.length;
    await article.save();
    res.json({ liked: !alreadyLiked, likesCount: article.likesCount });
  } catch (error) {
    console.error("Like article error:", error);
    res.status(500).json({ message: "Could not update like." });
  }
};

exports.addComment = async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid article ID." });
    const content = String(req.body.content || "").trim();
    if (!content || content.length > 2000) return res.status(400).json({ message: "Comment must be between 1 and 2,000 characters." });
    const article = await Article.findOne({ _id: req.params.id, published: true });
    if (!article) return res.status(404).json({ message: "Article not found." });
    let parent = null;
    if (req.body.parentId) {
      if (!validId(req.body.parentId)) return res.status(400).json({ message: "Invalid reply target." });
      parent = await Comment.findOne({ _id: req.body.parentId, article: article._id, parent: null });
      if (!parent) return res.status(404).json({ message: "Comment to reply to was not found." });
    }
    const comment = await Comment.create({ article: article._id, author: req.user, parent: parent?._id || null, content });
    await comment.populate("author", authorFields);
    res.status(201).json({ comment: { ...commentPayload(comment, req.user), replies: [] } });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Could not add comment." });
  }
};

exports.toggleCommentLike = async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid comment ID." });
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found." });
    const alreadyLiked = comment.likes.some((id) => String(id) === String(req.user));
    if (alreadyLiked) comment.likes.pull(req.user); else comment.likes.addToSet(req.user);
    await comment.save();
    res.json({ liked: !alreadyLiked, likesCount: comment.likes.length });
  } catch (error) {
    console.error("Like comment error:", error);
    res.status(500).json({ message: "Could not update comment like." });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid comment ID." });
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found." });
    if (String(comment.author) !== String(req.user)) return res.status(403).json({ message: "You can only delete your own comments." });
    const ids = [comment._id];
    if (!comment.parent) {
      const replies = await Comment.find({ parent: comment._id }).select("_id").lean();
      ids.push(...replies.map((reply) => reply._id));
    }
    const result = await Comment.deleteMany({ _id: { $in: ids } });
    res.json({ message: "Comment deleted.", deletedCount: result.deletedCount || 1 });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ message: "Could not delete comment." });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    if (!validId(req.params.userId)) return res.status(400).json({ message: "Invalid user ID." });
    const user = await User.findById(req.params.userId).select("name profilePhoto.url createdAt").lean();
    if (!user) return res.status(404).json({ message: "Contributor not found." });
    res.json({ user: { id: user._id, name: user.name, avatar: user.profilePhoto?.url || "", joinedAt: user.createdAt } });
  } catch (error) {
    res.status(500).json({ message: "Could not load contributor profile." });
  }
};

exports.getUserArticles = async (req, res) => {
  try {
    if (!validId(req.params.userId)) return res.status(400).json({ message: "Invalid user ID." });
    const articles = await Article.find({ author: req.params.userId, published: true }).populate("author", authorFields).sort({ createdAt: -1 }).limit(50).lean();
    const ids = articles.map((article) => article._id);
    const counts = ids.length ? await Comment.aggregate([{ $match: { article: { $in: ids } } }, { $group: { _id: "$article", count: { $sum: 1 } } }]) : [];
    const countMap = new Map(counts.map((item) => [String(item._id), item.count]));
    res.json({ articles: articles.map((article) => articlePayload(article, req.user, countMap.get(String(article._id)) || 0)) });
  } catch (error) {
    console.error("User articles error:", error);
    res.status(500).json({ message: "Could not load user articles." });
  }
};
