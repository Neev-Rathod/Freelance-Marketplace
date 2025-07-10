const mongoose = require("mongoose");
const { Schema } = mongoose;

const DisputeSchema = new Schema({
  job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  raisedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  against: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ["open", "resolved", "rejected"],
    default: "open",
  },
  resolution: String,
  admin: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Dispute", DisputeSchema);
