const Chats = require("../models/chats");

const apiUrl = "http://localhost:3000";

const mongoose = require("mongoose");
exports.get_Chats = (req, res, next) => {
  //   function isGetById() {
  //     if (req.body.userId != null) {
  //       return { userId: req.body.userId };
  //     } else {
  //       return {};
  //     }
  //   }
  Chats.find({
    properties: req.body.userId,
    // userId: req.body.userId,
  })

    .exec()
    .then((docs) => {
      //   console.log(docs);
      if (docs.length > 0) {
        const response = {
          count: docs.length,

          chat: docs.map((doc) => {
            return {
              _id: doc.id,
              //   doctorId: doc.doctorId,
              //   userId: doc.userId,
              properties: doc.properties,
              sender: doc.sender,
              text: doc.text,
              createdAt: doc.createdAt,
              updatedAt: doc.updatedAt,

              //   request: {
              //     type: "GET",
              //     url: apiUrl + "/Appointment/" + doc.id,
              //   },
            };
          }),
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "No  entries found ",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
exports.create_chat = (req, res, next) => {
  //   console.log(req.body.Messages[0].sender);
  const messages = Chats({
    _id: new mongoose.Types.ObjectId(),
    // doctorId: req.body.doctorId,
    // userId: req.body.userId,
    sender: req.body.sender,
    text: req.body.text,
    properties: req.body.properties,
    // Messages: [
    //   {
    //     sender: req.body.Messages[0].sender,
    //     text: req.body.Messages[0].text,
    //   },
    // ],
  });

  messages
    .save()
    .then((result) => {
      res.status(201).json(
        // result
        {
          message: "Appointment successfully stored",
          //   chat: {
          properties: result.properties,
          //   Messages: result.Messages,
          _id: result.id,
          //   doctorId: result.doctorId,
          //   userId: result.userId,
          sender: result.sender,
          text: result.text,
          //   {
          //     sender: result.Messages[0].sender,
          //     text: result.Messages[0].text,
          //   },
          // ],

          // request: {
          //   type: "GET",
          //   url: apiUrl + "/chat/",
          // },
          //   },
        }
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Chats ID not fond",

        error: err,
      });
    });
  //////////
};

exports.delate_chat = (req, res, next) => {
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

exports.update_chat = (req, res, next) => {
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
        chat: {
          _id: result.id,
          Chats: result.Chats,
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
