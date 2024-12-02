const express = require("express");
const router = express.Router();

// const checkAuth = require("../middleware/check-auth");

const ordersContrller = require("../controller/orders");
router.get("/:userId", ordersContrller.get_all_orders);

router.post("/", ordersContrller.create_orders);

// router.get("/:orderId",  ordersContrller.find_order_byId);

// router.delete("/:orderId",  ordersContrller.delate_order);
router.patch("/:orderId", ordersContrller.cancel_order);
module.exports = router;
