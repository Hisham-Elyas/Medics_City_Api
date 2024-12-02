const express = require("express");
const router = express.Router();

const dctorContrller = require("../controller/doctors");

router.get("/", dctorContrller.get_all_doctor);
router.post("/", dctorContrller.create_doctor);
// router.get("/Randpro/:limit", drugsContrller.get_random_product);
// router.get("/search/:name", drugsContrller.find_product_bySearch);
// router.get("/:proudctId", drugsContrller.find_byId);
// router.patch("/:proudctId", checkAuth, productContrller.update_product);
// router.delete("/:proudctId", checkAuth, productContrller.delete_product);
module.exports = router;
