const express = require("express");
const router = express.Router();

const chatsContrller = require("../controller/chats");
router.get("/", chatsContrller.get_Chats);

router.post("/", chatsContrller.create_chat);

// router.delete("/:AppointmentId", chatsContrller.delate_appointment);
// router.patch("/:AppointmentId", chatsContrller.update_appointment);

module.exports = router;
