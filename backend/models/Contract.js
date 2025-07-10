const mongoose = require("mongoose");
const { Schema } = mongoose;

const ContractSchema = new Schema({
  job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  client: { type: Schema.Types.ObjectId, ref: "User", required: true },
  freelancer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  terms: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  status: {
    type: String,
    enum: ["active", "completed", "cancelled"],
    default: "active",
  },
});

module.exports = mongoose.model("Contract", ContractSchema);
