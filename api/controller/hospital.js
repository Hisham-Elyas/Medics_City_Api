const hospital = require("../models/hospital");
const mongoose = require("mongoose");
const apiUrl = "http://localhost:3000";

exports.create_hospital = (req, res, next) => {
  const Hospital = new hospital({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    address: req.body.address,
    phoneNunber: req.body.phoneNunber,
    img: req.body.img,
  });
  Hospital.save()
    .then((result) => {
      // console.log(result);
      res.status(201).json({
        message: "Created successfully",
        hospital: {
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

exports.get_all_hospital = (req, res, next) => {
  const limit = req.body.limit;
  hospital
    .find()
    .limit(limit)
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,

        hospitals: docs.map((doc) => {
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
