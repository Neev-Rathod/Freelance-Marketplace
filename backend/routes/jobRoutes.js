const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const { auth, authorize } = require("../middleware/auth");

// Protected routes
router.post("/", auth, authorize("client"), jobController.create);
router.get("/", auth, authorize("freelancer", "admin"), jobController.getAll);
router.get("/my-jobs", auth, authorize("client"), jobController.getClientJobs);
router.get("/:id", auth, jobController.getSingle);
router.put("/:id", auth, authorize("client"), jobController.update);
router.put("/:id/close", auth, authorize("client"), jobController.closeJob);

// Admin routes
router.put(
  "/:id/moderate",
  auth,
  authorize("admin"),
  jobController.adminModerateJob
);

module.exports = router;
