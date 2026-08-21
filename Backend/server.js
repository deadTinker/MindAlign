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


    const PORT = process.env.PORT || 5000

    app.listen(PORT, () => {

      console.log(`Server is running on port ${PORT}`);
    });
  })

  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });