const Appointment = require("../models/appointment");

const Doctor = require("../models/doctors");
const apiUrl = "http://localhost:3000";

const mongoose = require("mongoose");
exports.get_all_Appointment = (req, res, next) => {
  function isGetById() {
    if (req.body.userId != null) {
      return { userId: req.body.userId };
    } else {
      return {};
    }
  }
  Appointment.find(isGetById())
    .select(
      "_id name userId bookDate isConfirmed isCompleted  doctor createdAt updatedAt"
    )
    .populate(
      "doctor",
      "id name address  specialty  email  phoneNunber  hoursOfOperation "
    )
    .exec()
    .then((docs) => {
      //   console.log(docs);
      if (docs.length > 0) {
        const response = {
          count: docs.length,

          appointment: docs.map((doc) => {
            return {
              id: doc.id,
              name: doc.name,
              userId: doc.userId,
              bookDate: doc.bookDate,
              isConfirmed: doc.isConfirmed,
              isCompleted: doc.isCompleted,

              createdAt: doc.createdAt,
              updatedAt: doc.updatedAt,

              doctor: doc.doctor,
              request: {
                type: "GET",
                url: apiUrl + "/Appointment/" + doc.id,
              },
            };
          }),
        };
        res.status(200).json(response);
      } else {
        const response = {
          count: docs.length,

          appointment: [],
        };
        res.status(200).json(response);
        // res.status(404).json({
        //   message: "No  entries found ",
        // });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
exports.create_appointment = (req, res, next) => {
  const idDoctor = req.body.doctor["id"] ?? req.body.doctor;

  Doctor.findById(idDoctor)
    .exec()
    .then((doctors) => {
      if (doctors) {
        const appointment = Appointment({
          _id: new mongoose.Types.ObjectId(),
          doctor: idDoctor,
          name: req.body.name,
          userId: req.body.userId,
          bookDate: req.body.bookDate,
        });
        appointment
          .save()
          .then((result) => {
            res.status(201).json(
              // result
              {
                message: "Appointment successfully stored",
                appointment: {
                  _id: result.id,
                  doctor: result.doctor,
                  name: result.name,
                  userId: result.userId,
                  bookDate: result.bookDate,
                  isConfirmed: result.isConfirmed,
                  isCompleted: result.isCompleted,

                  createdAt: result.createdAt,
                  updatedAt: result.updatedAt,

                  request: {
                    type: "GET",
                    url: apiUrl + "/appointment/" + result.id,
                  },
                },
              }
            );
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: "doctor ID not fond",

              error: err,
            });
          });
        //////////
      } else {
        res.status(404).json({
          message: "No valid entry found          ",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "doctors ID not fond",

        error: err,
      });
    });
};

exports.delate_appointment = (req, res, next) => {
  const id = req.params.AppointmentId;
  Appointment.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      // console.log(result);
      if (result.deletedCount != 0) {
        res.status(200).json({
          message: "Appointment delete",
          request: {
            type: "POST",
            description: "POST to add new Appointment ",

            url: apiUrl + "/Appointment",
          },
        });
      } else {
        res.status(404).json({
          message: "No valid entry found for provided ID",
        });
      }
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.update_appointment = (req, res, next) => {
  const id = req.params.AppointmentId;
  console.log(id);

  Appointment.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        name: req.body.name,
        userId: req.body.userId,
        bookDate: req.body.bookDate,
      },
    },
    { new: true }
  )
    .exec()
    .then((result) => {
      // console.log(result);
      res.status(200).json({
        message: "Appointment successfully Update",
        appointment: {
          _id: result.id,
          doctor: result.doctor,
          name: result.name,
          userId: result.userId,
          bookDate: result.bookDate,
          isConfirmed: result.isConfirmed,
          isCompleted: result.isCompleted,

          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        },
        request: {
          type: "GET",
          description: "GET All Appointment ",

          url: apiUrl + "/Appointment",
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
