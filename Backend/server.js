const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const authenticationRoutes = require("./routes/auth");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authenticationRoutes);



// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });