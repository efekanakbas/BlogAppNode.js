    const express = require("express");
    const app = express();
    const cors = require("cors");
    const mongoose = require("mongoose");
    const routerFeed = require("./routes/feed");
    const routerAuth = require("./routes/auth");
    const https = require('https');
    const fs = require('fs');
    require("dotenv").config();

    // License options

    const options = {
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.crt'),
    };
    const server = https.createServer(options, app);

    // Mongo DB Connections
    mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connection Succeeded.");
    })
    .catch((error) => {
        console.log("Error in DB connection: " + error);
    });

    // Middleware Connections
    app.use(cors());
    app.use(express.json({ limit: "30mb", extended: true }));
    app.use(express.urlencoded({ limit: "30mb", extended: true }));
    app.use('/uploads', express.static('uploads'))

    // Routes
    app.use('/', routerFeed)
    app.use('/', routerAuth)
    app.get('/', (req, res) => {
        res.json({
            message: 'Hello World!'
        })
    })

    // Connection
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, '0.0.0.0', () => {
    console.log("App running in port: " + PORT);
    });