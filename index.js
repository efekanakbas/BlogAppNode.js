const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const routerFeed = require("./routes/feed");
const routerAuth = require("./routes/auth");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Mongo DB Connections
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connection Succeeded.");
  })
  .catch((error) => {
    console.log("Error in DB connection: " + error);
  });

  // Cloudinary Configirations
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware Connections
app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/", routerFeed);
app.use("/", routerAuth);
app.get("/", (req, res) => {
  res.json({
    message: "HELLO WORLD!!!",
  });
});

// Connection
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("App running in port: " + PORT);
});
