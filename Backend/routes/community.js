const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const controller = require("../controllers/communityController");
const router = express.Router();

router.use(authMiddleware);
router.get("/articles", controller.listArticles);
router.post("/articles", controller.createArticle);
router.get("/articles/:id", controller.getArticle);
router.put("/articles/:id", controller.updateArticle);
router.delete("/articles/:id", controller.deleteArticle);
router.post("/articles/:id/like", controller.toggleLike);
router.post("/articles/:id/comments", controller.addComment);
router.post("/comments/:id/like", controller.toggleCommentLike);
router.delete("/comments/:id", controller.deleteComment);
router.get("/users/:userId", controller.getUserProfile);
router.get("/users/:userId/articles", controller.getUserArticles);

module.exports = router;
