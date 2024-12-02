const mongoose = require("mongoose");
const doctorSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    address: { type: String, required: true },
    specialty: {
      type: String,
      required: true,
      enum: [
        "General",
        "LungsSpecialist",
        "Dentist",
        "Psychiatrist",
        "Surgeon",
        "Cardiologist",
        "Covid",
      ],
    },
    email: { type: String, required: true },
    phoneNunber: { type: Number, required: true },
    hoursOfOperation: { type: String, required: true },
    description: { type: String, required: true },
    img: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
