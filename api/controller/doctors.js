const doctor = require("../models/doctors");
const mongoose = require("mongoose");
const apiUrl = "http://localhost:3000";

exports.create_doctor = (req, res, next) => {
  //   console.log(req.body.DrugInformationar);
  //   console.log(req.body.drugInformationEn["Trade Name"]);
  const Doctor = new doctor({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    address: req.body.address,
    specialty: req.body.specialty,
    email: req.body.email,
    phoneNunber: req.body.phoneNunber,
    hoursOfOperation: req.body.hoursOfOperation,
    description: req.body.description,
    img: req.body.img,
  });
  Doctor.save()
    .then((result) => {
      // console.log(result);
      res.status(201).json({
        message: "Created successfully",
        doctor: {
          id: result.id,
          name: result.name,
          address: result.address,
          specialty: result.specialty,
          email: result.email,
          phoneNunber: result.phoneNunber,
          hoursOfOperation: result.hoursOfOperation,
          description: result.description,
          img: result.img,
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

exports.get_all_doctor = (req, res, next) => {
  const limit = req.body.limit;
  doctor
    .find()
    // .skip(Math.floor(Math.random() * 1000))
    // .select(
    //   " _id name address  specialty  email  phoneNunber  hoursOfOperation"
    // )
    .limit(limit)
    .exec()
    .then((docs) => {
      ///   192.168.117.2
      // console.log(docs.length);
      if (docs.length > 0) {
        const response = {
          count: docs.length,

          doctor: docs.map((doc) => {
            return {
              id: doc.id,
              name: doc.name,
              address: doc.address,
              specialty: doc.specialty,
              email: doc.email,
              phoneNunber: doc.phoneNunber,
              hoursOfOperation: doc.hoursOfOperation,
              description: doc.description,
              img: doc.img,
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

// exports.find_doctor_bySearch = (req, res, next) => {
//   const prodName = req.params.name;
//   doctor
//     .find({
//       name: { $regex: `^${prodName}`, $options: "i" },
//     })
//     .select(" _id name drugInformationEn drugInformationAr images pdf")
//     // .skip(20)
//     // .limit(0)
//     .exec()
//     .then((doc) => {
//       if (doc.length > 0) {
//         res.status(200).json({
//           count: doc.length,
//           product: doc,
//           // sh: doc.map((doc) => {
//           //   return {
//           //     Name: doc.name,
//           //   };
//           // }),
//           // request: {
//           //   type: "GET",
//           //   description: "GET All Prouduct ",
//           //   url: apiUrl + "/products",
//           // },
//         });
//       } else {
//         res.status(404).json({
//           count: doc.length,
//           message: `No valid entry found for ${prodName}`,
//         });
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({
//         error: err,
//       });
//     });
// };

// exports.find_byId = (req, res, next) => {
//   const id = req.params.proudctId;
//   doctor
//     .findById(id)
//     .select(" _id name drugInformationEn drugInformationAr images pdf")
//     .exec()
//     .then((doc) => {
//       // console.log(doc);
//       if (doc) {
//         res.status(200).json({
//           // count: doc.length,
//           product: doc,
//         });
//       } else {
//         res.status(404).json({
//           message: `No valid entry found for Id : ${id}`,
//         });
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({
//         error: err,
//       });
//     });
// };
// exports.get_random_doctor = (req, res, next) => {
//   const limit = req.params.limit;
//   doctor
//     .aggregate([{ $sample: { size: parseInt(limit) } }])
//     .exec()
//     .then((docs) => {
//       ///   192.168.117.2
//       // console.log(docs.length);
//       if (docs.length > 0) {
//         const response = {
//           count: docs.length,

//           product: docs.map((doc) => {
//             console.log(doc.name);
//             return {
//               _id: doc._id,
//               name: doc.name,
//               drugInformationEn: doc.drugInformationEn,
//               drugInformationAr: doc.drugInformationAr,
//               images: doc.images,
//               pdf: doc.pdf,

//               // request: {
//               //   type: "GET",
//               //   url: apiUrl + "/products/" + doc.id,
//               // },
//             };
//           }),
//         };
//         res.status(200).json(response);
//       } else {
//         res.status(404).json({
//           message: "No  entries found ",
//         });
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({
//         error: err,
//       });
//     });
// };
