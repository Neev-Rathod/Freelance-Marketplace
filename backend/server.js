// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
// Import routes
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const contractRoutes = require("./routes/contractRoutes");
const disputeRoutes = require("./routes/disputeRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("hello world");
});
// Routes
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/disputes", disputeRoutes);
app.use("/api/ratings", ratingRoutes);
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
