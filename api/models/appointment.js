const mongoose = require("mongoose");
const appointmentSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    userId: { type: String, required: true },
    isConfirmed: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },

    bookDate: { type: String, required: true },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
