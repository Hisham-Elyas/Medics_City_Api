const mongoose = require("mongoose");
const chatsSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    // doctorId: { type: String, required: true },
    // userId: { type: String, required: true },
    // sender: { type: String, required: true },
    // text: { type: String, required: true },
    properties: [{ type: String }],
    // owner: { type: collection },
    sender: { type: String },
    text: { type: String },
    // timestamps: true,

    // properties: { type: String },
    // Messages: [
    //   {
    //     sender: { type: String },
    //     text: { type: String },
    //     // timestamps: true,
    //   },
    // ],

    // address: { type: String, required: true },
    // email: { type: String, required: true },
    // phoneNunber: { type: Number, required: true },
    // hoursOfOperation: { type: String, required: true },
    // description: { type: String, required: true },
    // img: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chats", chatsSchema);
