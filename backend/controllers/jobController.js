const Job = require("../models/Jobs");
const Application = require("../models/Application");

const jobController = {
  // Create job
  create: async (req, res) => {
    try {
      const job = new Job({
        ...req.body,
        client: req.user._id,
      });

      await job.save();
      await job.populate("client", "name email");

      res.status(201).json({ message: "Job created successfully", job });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all jobs
  getAll: async (req, res) => {
    try {
      const { category, budget, status } = req.query;
      const filter = {};

      if (category) filter.category = category;
      if (budget) filter.budget = { $lte: parseInt(budget) };
      if (status) filter.status = status;

      const jobs = await Job.find(filter)
        .populate("client", "name email company")
        .sort({ createdAt: -1 });

      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get single job
  getSingle: async (req, res) => {
    try {
      const job = await Job.findById(req.params.id)
        .populate("client", "name email company")
        .populate("applications")
        .populate("hiredFreelancer", "name email skills");

      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      res.json(job);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get client's jobs
  getClientJobs: async (req, res) => {
    try {
      const jobs = await Job.find({ client: req.user._id })
        .populate("applications")
        .populate("hiredFreelancer", "name email")
        .sort({ createdAt: -1 });

      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update job
  update: async (req, res) => {
    try {
      const job = await Job.findOne({
        _id: req.params.id,
        client: req.user._id,
      });

      if (!job) {
        return res.status(404).json({ error: "Job not found or unauthorized" });
      }

      if (job.status !== "open") {
        return res
          .status(400)
          .json({ error: "Cannot update job that is not open" });
      }

      Object.assign(job, req.body);
      await job.save();

      res.json({ message: "Job updated successfully", job });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Close job
  closeJob: async (req, res) => {
    try {
      const job = await Job.findOne({
        _id: req.params.id,
        client: req.user._id,
      });

      if (!job) {
        return res.status(404).json({ error: "Job not found or unauthorized" });
      }

      job.status = "cancelled";
      await job.save();

      res.json({ message: "Job closed successfully", job });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Admin: Moderate job
  adminModerateJob: async (req, res) => {
    try {
      const { status } = req.body;
      const job = await Job.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      res.json({ message: "Job moderated successfully", job });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = jobController;
