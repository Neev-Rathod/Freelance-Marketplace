const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const { auth, authorize } = require("../middleware/auth");

// Protected routes
router.post(
  "/",
  auth,
  authorize("client", "freelancer"),
  ratingController.create
);

// Public route (can be accessed by anyone to view ratings)
router.get("/users/:userId/ratings", ratingController.getUserRatings);

module.exports = router;
