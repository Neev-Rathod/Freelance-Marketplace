const mongoose = require("mongoose");
const { Schema } = mongoose;

const ApplicationSchema = new Schema({
  job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  freelancer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  coverLetter: { type: String, required: true },
  bidAmount: { type: Number, required: true },
  deliveryTimeline: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "withdrawn"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Application", ApplicationSchema);
