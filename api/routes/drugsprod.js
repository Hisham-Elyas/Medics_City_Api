const express = require("express");
const router = express.Router();
// const checkAuth = require("../middleware/check-auth");
const drugsContrller = require("../controller/drugsprod");

const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//     // console.log(file);
//   },
//   filename: function (req, file, cb) {
//     const filename = new Date().toISOString() + file.originalname;
//     cb(null, file.originalname);
//     // cb(null, file.originalname);
//     // console.log(new Date().toISOString() + file.originalname);
//   },
// });
// const fileFilters = (req, file, cb) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5,
//   },
//   fileFilter: fileFilters,
// });
// const upload = multer({ dest: "uploads/" });

router.get("/", drugsContrller.get_all_product);
router.get("/Randpro/:limit", drugsContrller.get_random_product);
router.post(
  "/",
  //   checkAuth,
  //   upload.single("productImage"),
  drugsContrller.create_product
);
router.get("/search/:name", drugsContrller.find_product_bySearch);
router.get("/:proudctId", drugsContrller.find_byId);
// router.patch("/:proudctId", checkAuth, productContrller.update_product);
// router.delete("/:proudctId", checkAuth, productContrller.delete_product);
module.exports = router;
