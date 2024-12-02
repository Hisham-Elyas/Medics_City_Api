const mongoose = require("mongoose");
const drugsSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, require: true },

    drugInformationAr: { type: Map, required: true },
    drugInformationEn: { type: Map, required: true },
    images: { type: String, required: true },
    pdf: { type: String },
  },
  { timestamps: true }
);
// drugsSchema.index({ name: "text" });

module.exports = mongoose.model("Drugs", drugsSchema);
