// import express from 'express';
const exprss = require("express");
const app = exprss();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const scrapeTodayMatches = require("./scrape");
const fs = require("fs");
const path = require("path");
const doctorRoutes = require("./api/routes/doctors");
const appointmentRoutes = require("./api/routes/appointment");
const drugsprodproductRoutes = require("./api/routes/drugsprod");
const chatsRoutes = require("./api/routes/chates");
const hospitalRoutes = require("./api/routes/hospital");
const ambulanceRoutes = require("./api/routes/ambulance");
const today_matchesRoutes = require("./api/routes/today_matches");
const orderRoutes = require("./api/routes/orders");
// doctor;
// mongoose.connect(process.env.MONGO_ATLAS_PW,{useMongoClient:true})
// mongoose.connect("mongodb://localhost:27017/rest_api");

mongoose.connect(
  `mongodb+srv://hishaam6618:1057&1057@medics-city-api.ycon9.mongodb.net/medics-city-api?retryWrites=true&w=majority&appName=medics-city-api`
);
mongoose.Promise = global.Promise;
app.use(morgan("dev"));
app.use("/uploads", exprss.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/doctor", doctorRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/drugs", drugsprodproductRoutes);
app.use("/orders", orderRoutes);
app.use("/chats", chatsRoutes);
app.use("/hospitals", hospitalRoutes);
app.use("/ambulance", ambulanceRoutes);
app.use("/today_matches", today_matchesRoutes);
app.get("/api/run-script", (req, res) => {
  scrapeTodayMatches.scrapeTodayMatches();
  res.json("Script executed successfully!");
});
app.get("/api/run-script/log", (req, res) => {
  const filePath = path.join(__dirname, "./api/Logs/log.txt");

  // try {
  console.log(filePath);

  // Read the Log file after scraping
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Failed to read the file" });
    }

    try {
      res.send(data);
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      res.status(500).json({ error: "Invalid JSON format in the file" });
    }
  });
});
app.use((req, res, next) => {
  const error = new Error("Not Found 404 Home");
  error.status = 404;
  next(error);
});
// app.use((req, res, next) => {
//   fs.createReadStream(__dirname + "/public/index.html").pipe(res);
// });
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
module.exports = app;
