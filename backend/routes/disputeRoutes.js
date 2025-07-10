const express = require("express");
const router = express.Router();
const disputeController = require("../controllers/disputeController");
const { auth, authorize } = require("../middleware/auth");

// Protected routes
router.post(
  "/",
  auth,
  authorize("client", "freelancer"),
  disputeController.create
);

// Admin routes
router.get(
  "/admin/disputes",
  auth,
  authorize("admin"),
  disputeController.getAll
);
router.put(
  "/admin/disputes/:id/resolve",
  auth,
  authorize("admin"),
  disputeController.resolve
);

module.exports = router;
