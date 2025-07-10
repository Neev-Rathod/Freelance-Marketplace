const mongoose = require("mongoose");
const { Schema } = mongoose;

const RatingSchema = new Schema({
  job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  from: { type: Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  review: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Rating", RatingSchema);
