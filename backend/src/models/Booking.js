const mongoose = require("mongoose");
const BOOKING_STATUS = require("../constants/bookingStatus");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    halls: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hall",
        required: true
      }
    ],

    eventDate: {
      type: Date,
      required: true
    },

    startTime: {
      type: String,
      required: true
    },

    endTime: {
      type: String,
      required: true
    },

    eventType: {
      type: String
    },

    numberOfGuests: {
      type: Number
    },

    specialRequirements: {
      type: String
    },

    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.ACTION_PENDING
    },

    totalAmount: {
      type: Number,
      default: 0
    },

    remarks: {
      type: String
    },

    adminComments: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
