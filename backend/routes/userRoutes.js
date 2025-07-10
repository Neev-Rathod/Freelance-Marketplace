const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { auth, authorize } = require("../middleware/auth");

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected routes
router.get("/profile", auth, userController.getProfile);
router.put(
  "/profile",
  auth,
  authorize("client", "freelancer"),
  userController.updateProfile
);

// Admin routes
router.get("/", auth, authorize("admin"), userController.adminGetAllUsers);
router.put(
  "/:userId",
  auth,
  authorize("admin"),
  userController.adminDeactivateUser
);

module.exports = router;
