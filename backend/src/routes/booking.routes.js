const express = require("express");
const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/rbac");

const BOOKING_STATUS = require("../constants/bookingStatus");
const canTransition = require("../utils/canTransition");
const checkHallAvailability = require("../utils/checkHallAvailability");
const createInvoice = require("../utils/createInvoice");

const router = express.Router();

/**
 * GET MY BOOKINGS (USER)
 * GET /api/bookings/my
 */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId })
      .populate('halls', 'name capacity amenities')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (err) {
    console.error("GET MY BOOKINGS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

/**
 * GET ALL BOOKINGS (ADMIN)
 * GET /api/bookings
 */
router.get("/", authMiddleware, roleMiddleware(["ADMIN1", "ADMIN2", "ADMIN3", "SUPERADMIN"]), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('halls', 'name capacity amenities')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (err) {
    console.error("GET ALL BOOKINGS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

/**
 * GET BOOKING BY ID
 * GET /api/bookings/:id
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('halls', 'name capacity amenities')
      .populate('userId', 'name email phone');
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    // Users can only see their own bookings
    if (req.user.role === 'USER' && booking.userId._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    res.json(booking);
  } catch (err) {
    console.error("GET BOOKING ERROR:", err);
    res.status(500).json({ message: "Failed to fetch booking" });
  }
});

/**
 * USER → CREATE BOOKING
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { hallId, halls, eventDate, startTime, endTime, eventType, numberOfGuests, specialRequirements } = req.body;

    // Support both single hallId and halls array
    const hallsArray = halls || (hallId ? [hallId] : null);
    
    if (!hallsArray || !eventDate) {
      return res.status(400).json({ message: "Missing required fields: hallId/halls and eventDate" });
    }

    // Default times if not provided
    const bookingStartTime = startTime || "09:00";
    const bookingEndTime = endTime || "18:00";

    const booking = await Booking.create({
      userId: req.user.userId,
      halls: hallsArray,
      eventDate,
      startTime: bookingStartTime,
      endTime: bookingEndTime,
      eventType,
      numberOfGuests,
      specialRequirements
    });

    // Populate hall and user data for response
    await booking.populate('halls userId');

    return res.status(201).json(booking);
  } catch (err) {
    console.error("BOOKING CREATE ERROR:", err);
    return res.status(500).json({ message: "Failed to create booking", error: err.message });
  }
});

/**
 * FSM STATUS UPDATE
 */
router.post(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["USER", "ADMIN1", "ADMIN2", "ADMIN3"]),
  async (req, res) => {
    try {
      const { nextStatus, remarks } = req.body;

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }

      let booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (!canTransition(booking.status, req.user.role, nextStatus)) {
        return res.status(403).json({
          message: "Invalid status transition"
        });
      }

      /**
       * RACE-SAFE ADMIN2 APPROVAL
       */
      if (nextStatus === BOOKING_STATUS.ADMIN2_APPROVED) {
        const isAvailable = await checkHallAvailability({
          hallIds: booking.halls,
          eventDate: booking.eventDate,
          startTime: booking.startTime,
          endTime: booking.endTime
        });

        if (!isAvailable) {
          return res.status(409).json({
            message: "Hall not available for selected time"
          });
        }

        booking = await Booking.findOneAndUpdate(
          {
            _id: booking._id,
            status: BOOKING_STATUS.PAYMENT_COMPLETED
          },
          { status: BOOKING_STATUS.ADMIN2_APPROVED },
          { new: true }
        );

        if (!booking) {
          return res.status(409).json({
            message: "Booking already processed by another admin"
          });
        }
      } else {
        booking.status = nextStatus;
        if (remarks) booking.remarks = remarks;
        await booking.save();
      }

      /**
       * INVOICE CREATION
       */
      if (nextStatus === BOOKING_STATUS.PAYMENT_COMPLETED) {
        try {
          await createInvoice({ booking });
        } catch (err) {
          if (err.code !== 11000) throw err;
        }
      }

      return res.json({
        message: "Status updated successfully",
        booking
      });
    } catch (err) {
      console.error("STATUS UPDATE ERROR:", err);
      return res.status(500).json({ message: "Status update failed" });
    }
  }
);

module.exports = router;
