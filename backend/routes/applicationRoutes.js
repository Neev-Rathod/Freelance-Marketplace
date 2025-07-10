const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const { auth, authorize } = require("../middleware/auth");

// Protected routes
router.post(
  "/:jobId/applications",
  auth,
  authorize("freelancer"),
  applicationController.create
);
router.get(
  "/:jobId/applications",
  auth,
  authorize("client"),
  applicationController.getForJob
);
router.put(
  "/:id/accept",
  auth,
  authorize("client"),
  applicationController.accept
);
router.put(
  "/:id/reject",
  auth,
  authorize("client"),
  applicationController.reject
);

module.exports = router;
