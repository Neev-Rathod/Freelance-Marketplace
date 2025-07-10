const Contract = require("../models/Contract");
const Job = require("../models/Jobs");

const contractController = {
  // Get active contracts
  getActive: async (req, res) => {
    try {
      const filter = { status: "active" };

      if (req.user.role === "client") {
        filter.client = req.user._id;
      } else if (req.user.role === "freelancer") {
        filter.freelancer = req.user._id;
      }

      const contracts = await Contract.find(filter)
        .populate("job", "title description budget deadline")
        .populate("client", "name email company")
        .populate("freelancer", "name email skills")
        .sort({ startDate: -1 });

      res.json(contracts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Complete contract
  complete: async (req, res) => {
    try {
      const contract = await Contract.findById(req.params.id).populate("job");

      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }

      // Verify client ownership
      if (contract.client.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      if (contract.status !== "active") {
        return res.status(400).json({ error: "Contract is not active" });
      }

      // Update contract
      contract.status = "completed";
      contract.endDate = new Date();
      await contract.save();

      // Update job status
      await Job.findByIdAndUpdate(contract.job._id, { status: "completed" });

      res.json({ message: "Contract completed successfully", contract });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Terminate contract
  terminate: async (req, res) => {
    try {
      const contract = await Contract.findById(req.params.id).populate("job");

      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }

      // Verify client ownership
      if (contract.client.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      if (contract.status !== "active") {
        return res.status(400).json({ error: "Contract is not active" });
      }

      // Update contract
      contract.status = "cancelled";
      contract.endDate = new Date();
      await contract.save();

      // Update job status
      await Job.findByIdAndUpdate(contract.job._id, { status: "cancelled" });

      res.json({ message: "Contract terminated successfully", contract });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = contractController;
