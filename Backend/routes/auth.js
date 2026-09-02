const express = require("express");

const {
  signup,
  login,
  getProfile,
  updateUsername,
  updateEmail,
  updatePassword
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// Protected profile routes
router.get("/profile", authMiddleware, getProfile);

router.put(
  "/profile/username",
  authMiddleware,
  updateUsername
);

router.put(
  "/profile/email",
  authMiddleware,
  updateEmail
);

router.put(
  "/profile/password",
  authMiddleware,
  updatePassword
);

router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "You are authenticated",
    userId: req.user
  });
});

module.exports = router;