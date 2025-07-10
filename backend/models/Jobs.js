const mongoose = require("mongoose");
const { Schema } = mongoose;

const JobSchema = new Schema({
  client: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  budget: { type: Number, required: true },
  deadline: { type: Date, required: true },
  status: {
    type: String,
    enum: ["open", "in progress", "completed", "cancelled"],
    default: "open",
  },
  applications: [{ type: Schema.Types.ObjectId, ref: "Application" }],
  hiredFreelancer: { type: Schema.Types.ObjectId, ref: "User" },
  contract: { type: Schema.Types.ObjectId, ref: "Contract" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", JobSchema);
