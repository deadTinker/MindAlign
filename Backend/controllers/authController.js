const bcrypt = require("bcryptjs");
const User = require("../models/User");

const signup = async (req, res) => {
  try{
    const {name, email, password} = req.body;

    if (!name || !email || !password){
      return res.status(400).json({
        message: "Username, Email and password are required"
      });
    }

    const existingUser = await User.findOne({email});

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

    res.status(201).json({
      message:"Signup successful, New User created",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "There is an error in the Server"
    });
  }
};

module.exports = {
  signup
};