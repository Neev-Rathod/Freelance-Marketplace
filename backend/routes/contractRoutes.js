const express = require("express");
const router = express.Router();
const contractController = require("../controllers/contractController");
const { auth, authorize } = require("../middleware/auth");

// Protected routes
router.get(
  "/active",
  auth,
  authorize("client", "freelancer"),
  contractController.getActive
);
router.put(
  "/:id/complete",
  auth,
  authorize("client"),
  contractController.complete
);
router.put(
  "/:id/terminate",
  auth,
  authorize("client"),
  contractController.terminate
);

module.exports = router;
