const Rating = require("../models/Rating");
const User = require("../models/User");
const Job = require("../models/Jobs");

const ratingController = {
  // Create rating
  create: async (req, res) => {
    try {
      const { jobId, toUserId, rating, review } = req.body;

      // Verify job involvement
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      const isInvolved =
        job.client.toString() === req.user._id.toString() ||
        job.hiredFreelancer?.toString() === req.user._id.toString();

      if (!isInvolved) {
        return res
          .status(403)
          .json({ error: "Not authorized to rate for this job" });
      }

      // Check if rating already exists
      const existingRating = await Rating.findOne({
        job: jobId,
        from: req.user._id,
        to: toUserId,
      });

      if (existingRating) {
        return res
          .status(400)
          .json({ error: "Rating already exists for this job" });
      }

      // Create rating
      const newRating = new Rating({
        job: jobId,
        from: req.user._id,
        to: toUserId,
        rating,
        review,
      });

      await newRating.save();

      // Update user's average rating
      const userRatings = await Rating.find({ to: toUserId });
      const avgRating =
        userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;

      await User.findByIdAndUpdate(toUserId, {
        rating: parseFloat(avgRating.toFixed(1)),
        ratingsCount: userRatings.length,
      });

      await newRating.populate([
        { path: "job", select: "title" },
        { path: "from", select: "name" },
        { path: "to", select: "name" },
      ]);

      res
        .status(201)
        .json({ message: "Rating created successfully", rating: newRating });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get user ratings
  getUserRatings: async (req, res) => {
    try {
      const { userId } = req.params;

      const ratings = await Rating.find({ to: userId })
        .populate("job", "title")
        .populate("from", "name")
        .sort({ createdAt: -1 });

      res.json(ratings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = ratingController;
