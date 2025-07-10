const Dispute = require("../models/Dispute");
const Job = require("../models/Jobs");

const disputeController = {
  // Create dispute
  create: async (req, res) => {
    try {
      const { jobId, againstUserId, reason } = req.body;

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
          .json({ error: "Not authorized to create dispute for this job" });
      }

      const dispute = new Dispute({
        job: jobId,
        raisedBy: req.user._id,
        against: againstUserId,
        reason,
      });

      await dispute.save();
      await dispute.populate([
        { path: "job", select: "title" },
        { path: "raisedBy", select: "name email" },
        { path: "against", select: "name email" },
      ]);

      res
        .status(201)
        .json({ message: "Dispute created successfully", dispute });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Admin: Get all disputes
  getAll: async (req, res) => {
    try {
      const disputes = await Dispute.find()
        .populate("job", "title description")
        .populate("raisedBy", "name email")
        .populate("against", "name email")
        .populate("admin", "name email")
        .sort({ createdAt: -1 });

      res.json(disputes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Admin: Resolve dispute
  resolve: async (req, res) => {
    try {
      const { resolution, status } = req.body;

      const dispute = await Dispute.findById(req.params.id);
      if (!dispute) {
        return res.status(404).json({ error: "Dispute not found" });
      }

      if (dispute.status !== "open") {
        return res
          .status(400)
          .json({ error: "Dispute is already resolved or rejected" });
      }

      dispute.status = status; // 'resolved' or 'rejected'
      dispute.resolution = resolution;
      dispute.admin = req.user._id;
      await dispute.save();

      await dispute.populate([
        { path: "job", select: "title" },
        { path: "raisedBy", select: "name email" },
        { path: "against", select: "name email" },
        { path: "admin", select: "name email" },
      ]);

      res.json({ message: "Dispute resolved successfully", dispute });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = disputeController;
