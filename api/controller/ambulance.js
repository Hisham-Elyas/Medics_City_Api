const ambulance = require("../models/ambulances");
const mongoose = require("mongoose");
const apiUrl = "http://localhost:3000";

exports.create_ambulance = (req, res, next) => {
  const Ambulance = new ambulance({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    address: req.body.address,
    phoneNunber: req.body.phoneNunber,
    img: req.body.img,
  });
  Ambulance.save()
    .then((result) => {
      // console.log(result);
      res.status(201).json({
        message: "Created successfully",
        ambulance: {
          id: result.id,
          name: result.name,
          address: result.address,
          phoneNunber: result.phoneNunber,
          img: result.img,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_all_ambulance = (req, res, next) => {
  const limit = req.body.limit;
  ambulance
    .find()
    .limit(limit)
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,

        ambulances: docs.map((doc) => {
          return {
            id: doc.id,
            name: doc.name,
            address: doc.address,

            phoneNunber: doc.phoneNunber,

            img: doc.img,
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
