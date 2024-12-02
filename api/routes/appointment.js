const express = require("express");
const router = express.Router();

const appointmentContrller = require("../controller/appointment");
router.get("/:AppointmentId", appointmentContrller.get_all_Appointment);

router.post("/", appointmentContrller.create_appointment);

router.delete("/:AppointmentId", appointmentContrller.delate_appointment);
router.patch("/:AppointmentId", appointmentContrller.update_appointment);

module.exports = router;
