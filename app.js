// import express from 'express';
const exprss = require("express");
const app = exprss();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const doctorRoutes = require("./api/routes/doctors");
const appointmentRoutes = require("./api/routes/appointment");
const drugsprodproductRoutes = require("./api/routes/drugsprod");
const chatsRoutes = require("./api/routes/chates");
const hospitalRoutes = require("./api/routes/hospital");
const ambulanceRoutes = require("./api/routes/ambulance");
const orderRoutes = require("./api/routes/orders");

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

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
