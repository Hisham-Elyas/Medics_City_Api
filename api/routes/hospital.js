const express = require("express");
const router = express.Router();

const hospitalContrller = require("../controller/hospital");
router.get("/", hospitalContrller.get_all_hospital);

router.post("/", hospitalContrller.create_hospital);

module.exports = router;
