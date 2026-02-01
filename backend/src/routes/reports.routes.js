const express = require("express");
const Invoice = require("../models/Invoice");
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/rbac");

const router = express.Router();

/**
 * REVENUE REPORT
 */
router.get(
  "/revenue",
  authMiddleware,
  roleMiddleware(["ADMIN2", "ADMIN3", "SUPERADMIN"]),
  async (req, res) => {
    const revenue = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalInvoices: { $sum: 1 }
        }
      }
    ]);

    res.json(revenue[0] || { totalRevenue: 0, totalInvoices: 0 });
  }
);

/**
 * BOOKING STATUS REPORT
 */
router.get(
  "/booking-status",
  authMiddleware,
  roleMiddleware(["ADMIN2", "ADMIN3"]),
  async (req, res) => {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(stats);
  }
);

module.exports = router;
