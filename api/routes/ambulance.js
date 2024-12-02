const express = require("express");
const router = express.Router();

const ambulanceContrller = require("../controller/ambulance");
router.get("/", ambulanceContrller.get_all_ambulance);

router.post("/", ambulanceContrller.create_ambulance);

module.exports = router;
