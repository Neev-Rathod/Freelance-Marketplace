const Application = require("../models/Application");
const Job = require("../models/Jobs");
const Contract = require("../models/Contract");

const applicationController = {
  // Create application
  create: async (req, res) => {
    try {
      const { jobId } = req.params;
      const { coverLetter, bidAmount, deliveryTimeline } = req.body;

      // Check if job exists and is open
      const job = await Job.findById(jobId);
      if (!job || job.status !== "open") {
        return res
          .status(400)
          .json({ error: "Job not available for applications" });
      }

      // Check if freelancer already applied
      const existingApplication = await Application.findOne({
        job: jobId,
        freelancer: req.user._id,
      });

      if (existingApplication) {
        return res.status(400).json({ error: "Already applied to this job" });
      }

      // Create application
      const application = new Application({
        job: jobId,
        freelancer: req.user._id,
        coverLetter,
        bidAmount,
        deliveryTimeline,
      });

      await application.save();

      // Add application to job
      job.applications.push(application._id);
      await job.save();

      await application.populate("freelancer", "name email skills rating");

      res
        .status(201)
        .json({ message: "Application submitted successfully", application });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get applications for a job
  getForJob: async (req, res) => {
    try {
      const { jobId } = req.params;

      // Verify job belongs to client
      const job = await Job.findOne({ _id: jobId, client: req.user._id });
      if (!job) {
        return res.status(404).json({ error: "Job not found or unauthorized" });
      }

      const applications = await Application.find({ job: jobId })
        .populate("freelancer", "name email skills rating ratingsCount")
        .sort({ createdAt: -1 });

      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Accept application
  accept: async (req, res) => {
    try {
      const application = await Application.findById(req.params.id)
        .populate("job")
        .populate("freelancer");

      if (!application) {
        return res.status(404).json({ error: "App lication not found" });
      }

      // Verify job belongs to client
      if (application.job.client.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      if (application.status !== "pending") {
        return res.status(400).json({ error: "Application already processed" });
      }

      // Update application status
      application.status = "accepted";
      await application.save();

      // Update job
      const job = application.job;
      job.status = "in progress";
      job.hiredFreelancer = application.freelancer._id;
      await job.save();

      // Create contract
      const contract = new Contract({
        job: job._id,
        client: req.user._id,
        freelancer: application.freelancer._id,
        terms: `Job: ${job.title}\nBid Amount: $${application.bidAmount}\nDelivery Timeline: ${application.deliveryTimeline}`,
      });

      await contract.save();

      // Update job with contract
      job.contract = contract._id;
      await job.save();

      // Reject other applications
      await Application.updateMany(
        { job: job._id, _id: { $ne: application._id } },
        { status: "rejected" }
      );

      res.json({
        message: "Application accepted successfully",
        application,
        contract,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Reject application
  reject: async (req, res) => {
    try {
      const application = await Application.findById(req.params.id).populate(
        "job"
      );

      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      // Verify job belongs to client
      if (application.job.client.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      if (application.status !== "pending") {
        return res.status(400).json({ error: "Application already processed" });
      }

      application.status = "rejected";
      await application.save();

      res.json({ message: "Application rejected successfully", application });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = applicationController;
