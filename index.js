const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const routerFeed = require("./routes/feed");
const routerAuth = require("./routes/auth");
const routerMessage = require("./routes/message");
const http = require('http')
const { setupSocketIO } = require('./middleware/socket.js');
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

// Socket
const server = http.createServer(app);
setupSocketIO(server); 

// Middleware Connections
app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/", routerFeed);
app.use("/", routerAuth);
app.use("/", routerMessage)
app.get("/", (req, res) => {
  res.json({
    message: "HELLO WORLD!!!",
  });
});

// Connection
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("App running in port: " + PORT);
});
