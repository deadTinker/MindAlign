const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signup = async (req, res) => {
  try{
    const {name, email, password} = req.body;

    if (!name || !email || !password){
      return res.status(400).json({
        message: "Username, Email and Password are required"
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
      message: "There was an error in the Server"
    });
  }
};


const login = async (req, res) => {

  try{
    const {email, password} = req.body;

    if (!email || !password){
      return res.status(400).json({
        message: "Email and Password are required"
      });
    }

    const existingUser = await User.findOne({email});

    if (!existingUser){
      return res.status(400).json({
        message: "User does not exist with this email"
      });
    }

    const pswdMatch = await bcrypt.compare(password, existingUser.password);

    if (pswdMatch){
      const token = jwt.sign(
        { userId: existingUser._id },
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
      );

      return res.status(200).json({
        message: "Login successful",
        token: token
      });
    } else {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

  } catch(error) {
    console.error(error);

    res.status(500).json({
      message: "There was an error in server"
    });
  }
};


module.exports = {
  signup,
  login
};