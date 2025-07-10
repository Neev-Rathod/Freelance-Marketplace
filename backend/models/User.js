const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["client", "freelancer", "admin"],
    required: true,
  },
  bio: String,
  skills: [String], // For freelancers
  company: String, // For clients
  rating: { type: Number, default: 0 },
  ratingsCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("User", UserSchema);
