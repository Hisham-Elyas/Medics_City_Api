const mongoose = require("mongoose");
const orderSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    userInfo: { type: Map, required: true },
    userId: { type: String, required: true },
    userLocation: { type: Map, required: true },
    listProduct: { type: Array, required: true },
    status: { type: String, required: true, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", orderSchema);
