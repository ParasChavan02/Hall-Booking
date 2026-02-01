const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Hall = require("../models/Hall");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/rbac");

const router = express.Router();

/**
 * GET ALL HALLS (Public - authenticated users can view)
 * GET /api/admin/halls
 */
router.get("/halls", authMiddleware, async (req, res) => {
  try {
    const halls = await Hall.find({ isActive: true });
    res.json(halls);
  } catch (error) {
    console.error("Error fetching halls:", error);
    res.status(500).json({ message: "Failed to fetch halls" });
  }
});

/**
 * CREATE ADMIN USER
 * POST /api/admin/create-user
 */
router.post(
  "/create-user",
  authMiddleware,
  roleMiddleware(["SUPERADMIN", "ADMIN2"]),
  async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      // Basic validation
      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // 🚫 BLOCK SUPERADMIN CREATION
      if (role === "SUPERADMIN") {
        return res.status(403).json({
          message: "Cannot create SUPERADMIN via API"
        });
      }

      // 🚫 ADMIN2 CAN ONLY CREATE ADMIN1
      if (req.user.role === "ADMIN2" && role !== "ADMIN1") {
        return res.status(403).json({
          message: "ADMIN2 can only create ADMIN1"
        });
      }

      // 🚫 SUPERADMIN ROLE VALIDATION
      if (
        req.user.role === "SUPERADMIN" &&
        !["ADMIN1", "ADMIN2", "ADMIN3"].includes(role)
      ) {
        return res.status(400).json({
          message: "Invalid admin role"
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "User already exists"
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create admin user
      const newAdmin = await User.create({
        name,
        email,
        passwordHash,
        role
      });

      return res.status(201).json({
        message: "Admin user created successfully",
        user: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
