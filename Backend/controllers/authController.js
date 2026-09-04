const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Username, Email and Password are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exist with this email"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ 
    userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
    );

    res.status(201).json({
    message: "Signup successful, New User created",
    token,
    user: {
    id: user._id,
    name: user.name,
    email: user.email
  }
  });
  
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "There was an error in the Server"
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        message: "User does not exist with this email"
      });
    }

    const pswdMatch = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!pswdMatch) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "There was an error in server"
    });
  }
};


// GET CURRENT USER
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "There was an error in the server"
    });
  }
};


// CHANGE USERNAME
const updateUsername = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Username is required"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user,
      { name: name.trim() },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "Username updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to update username"
    });
  }
};


// CHANGE EMAIL
const updateEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const newEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: newEmail,
      _id: { $ne: req.user }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "This email is already in use"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user,
      { email: newEmail },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "Email updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to update email"
    });
  }
};


// CHANGE PASSWORD
const updatePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All password fields are required"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New passwords do not match"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters"
      });
    }

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Current password is incorrect"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to update password"
    });
  }
};


module.exports = {
  signup,
  login,
  getProfile,
  updateUsername,
  updateEmail,
  updatePassword
};