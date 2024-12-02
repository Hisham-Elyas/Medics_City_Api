const Orders = require("../models/orders");
const apiUrl = "http://localhost:3000";

const mongoose = require("mongoose");
exports.create_orders = (req, res, next) => {
  //   console.log(req.body);
  const orders = Orders({
    _id: new mongoose.Types.ObjectId(),
    userInfo: req.body.userInfo,
    userId: req.body.userId,
    userLocation: req.body.userLocation,
    listProduct: req.body.listProduct,
  });
  orders
    .save()
    .then((result) => {
      res.status(201).json(
        // result
        {
          message: "Order successfully stored",
          createdOrder: {
            _id: result.id,
            userId: result.userId,
            status: result.status,
            userInfo: result.userInfo,
            userLocation: result.userLocation,
            listProduct: result.listProduct,
            request: {
              type: "GET",
              url: apiUrl + "/orders/" + result.id,
            },
          },
        }
      );
    })

    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Product not fond",

        error: err,
      });
    });
};
exports.get_all_orders = (req, res, next) => {
  const id = req.params.userId;
  Orders.find({ userId: id })
    .exec()
    .then((docs) => {
      // console.log(doc);
      if (docs.length >= 0) {
        const response = {
          count: docs.length,
          producus: docs.map((doc) => {
            return {
              id: doc.id,
              userId: doc.userId,
              status: doc.status,
              userInfo: doc.userInfo,
              userLocation: doc.userLocation,
              listProduct: doc.listProduct,
              createdAt: doc.createdAt,
              updatedAt: doc.updatedAt,
              request: {
                type: "GET",
                url: apiUrl + "/order/" + doc.id,
              },
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
exports.delate_order = (req, res, next) => {
  const id = req.params.orderId;
  Orders.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Order delete",
        request: {
          type: "POST",
          description: "POST to add new Order ",

          url: apiUrl + "/orders",
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

exports.cancel_order = (req, res, next) => {
  const id = req.params.orderId;
  console.log(id);

  Orders.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        status: "cancel",
      },
    },
    { new: true }
  )
    .exec()
    .then((result) => {
      // console.log(result);
      res.status(200).json({
        message: "Orders successfully cancel",

        request: {
          type: "GET",
          description: "GET All orders ",

          url: apiUrl + "/orders",
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
