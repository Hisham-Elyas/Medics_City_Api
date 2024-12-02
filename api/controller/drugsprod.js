const drugsprod = require("../models/drugsprod");
const mongoose = require("mongoose");
const apiUrl = "http://localhost:3000";

exports.create_product = (req, res, next) => {
  //   console.log(req.body.DrugInformationar);
  //   console.log(req.body.drugInformationEn["Trade Name"]);
  const Drugproduct = new drugsprod({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.drugInformationEn["Trade Name"],

    drugInformationAr: req.body.drugInformationAr,
    drugInformationEn: req.body.drugInformationEn,
    images: req.body.images,
    pdf: req.body.pdf,
  });
  Drugproduct.save()
    .then((result) => {
      // console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProudct: {
          _id: result.id,
          Name: result.drugInformationEn.get("Trade Name"),
          drugInformationEn: result.drugInformationEn,
          drugInformationAr: result.drugInformationAr,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
          //   price: result.price,
          //   productImage: result.productImage,
          //   request: {
          //     type: "GET",
          //     url: apiUrl + "/drugs/" + result.id,
          //   },
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

exports.get_all_product = (req, res, next) => {
  const limit = req.body.limit;
  drugsprod
    .find()
    // .skip(Math.floor(Math.random() * 1000))
    .select(
      " _id name drugInformationEn drugInformationAr images pdf createdAt updatedAt"
    )
    .limit(limit)
    .exec()
    .then((docs) => {
      ///   192.168.117.2
      console.log(docs.length);
      if (docs.length > 0) {
        const response = {
          count: docs.length,

          product: docs.map((doc) => {
            return {
              _id: doc.id,
              name: doc.name,
              drugInformationEn: doc.drugInformationEn,
              drugInformationAr: doc.drugInformationAr,
              images: doc.images,
              pdf: doc.pdf,
              createdAt: doc.createdAt,
              updatedAt: doc.updatedAt,

              // request: {
              //   type: "GET",
              //   url: apiUrl + "/products/" + doc.id,
              // },
            };
          }),
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "No  entries found in drugs ",
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
exports.get_random_product = (req, res, next) => {
  const limit = req.params.limit;
  drugsprod
    .aggregate([{ $sample: { size: parseInt(limit) } }])
    .exec()
    .then((docs) => {
      ///   192.168.117.2
      // console.log(docs.length);
      if (docs.length > 0) {
        const response = {
          count: docs.length,

          product: docs.map((doc) => {
            console.log(doc.name);
            return {
              _id: doc._id,
              name: doc.name,
              drugInformationEn: doc.drugInformationEn,
              drugInformationAr: doc.drugInformationAr,
              images: doc.images,
              pdf: doc.pdf,
              createdAt: doc.createdAt,
              updatedAt: doc.updatedAt,

              // request: {
              //   type: "GET",
              //   url: apiUrl + "/products/" + doc.id,
              // },
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

exports.find_product_bySearch = (req, res, next) => {
  const prodName = req.params.name;
  drugsprod
    .find({
      name: { $regex: `^${prodName}`, $options: "i" },
    })
    .select(
      " _id name drugInformationEn drugInformationAr images pdf createdAt updatedAt"
    )
    // .skip(20)
    // .limit(0)
    .exec()
    .then((doc) => {
      if (doc.length > 0) {
        res.status(200).json({
          count: doc.length,
          product: doc,
          // sh: doc.map((doc) => {
          //   return {
          //     Name: doc.name,
          //   };
          // }),
          // request: {
          //   type: "GET",
          //   description: "GET All Prouduct ",
          //   url: apiUrl + "/products",
          // },
        });
      } else {
        res.status(404).json({
          count: doc.length,
          message: `No valid entry found for ${prodName}`,
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

exports.find_byId = (req, res, next) => {
  const id = req.params.proudctId;
  drugsprod
    .findById(id)
    .select(
      " _id name drugInformationEn drugInformationAr images pdf createdAt updatedAt"
    )
    .exec()
    .then((doc) => {
      // console.log(doc);
      if (doc) {
        res.status(200).json({
          // count: doc.length,
          product: doc,
        });
      } else {
        res.status(404).json({
          message: `No valid entry found for Id : ${id}`,
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

// exports.update_product = (req, res, next) => {
//   const id = req.params.proudctId;
//   const updateOps = {};
//   for (const ops of req.body) {
//     updateOps[ops.propName] = ops.value;
//   }
//   Product.findByIdAndUpdate(
//     { _id: id },
//     {
//       $set: updateOps,
//     },
//     { new: true }
//   )
//     .exec()
//     .then((result) => {
//       console.log(result);
//       res.status(200).json({
//         updateProudct: {
//           _id: result.id,
//           name: result.name,
//           price: result.price,
//           productImage: result.productImage,
//         },
//         request: {
//           type: "GET",
//           description: "GET All Prouduct ",

//           url: apiUrl + "/products",
//         },
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({
//         error: err,
//       });
//     });
// };
// exports.delete_product = (req, res, next) => {
//   const id = req.params.proudctId;
//   Product.deleteOne({ _id: id })
//     .exec()
//     .then((result) => {
//       console.log(result);
//       res.status(200).json({
//         message: "Product delete",
//         request: {
//           type: "POST",
//           description: "POST to add new Prouduct ",

//           url: apiUrl + "/products",
//         },
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({
//         error: err,
//       });
//     });
// };
