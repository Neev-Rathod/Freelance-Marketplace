const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userController = {
  // Register user
  register: async (req, res) => {
    try {
      const { name, email, password, role, bio, skills, company } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        bio,
        skills: role === "freelancer" ? skills : undefined,
        company: role === "client" ? company : undefined,
      });

      await user.save();

      // Generate JWT
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user || !user.isActive) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // Generate JWT
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get user profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("-password");
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const updates = req.body;
      delete updates.password; // Prevent password update through this endpoint
      delete updates.email; // Prevent email update
      delete updates.role; // Prevent role update

      const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
      }).select("-password");

      res.json({ message: "Profile updated successfully", user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Admin: Get all users
  adminGetAllUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Admin: Deactivate user
  adminDeactivateUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findByIdAndUpdate(
        userId,
        { isActive: false },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ message: "User deactivated successfully", user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = userController;
