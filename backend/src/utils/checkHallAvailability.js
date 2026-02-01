const Booking = require("../models/Booking");
const BOOKING_STATUS = require("../constants/bookingStatus");

const BLOCKING_STATUSES = [
  BOOKING_STATUS.PAYMENT_COMPLETED,
  BOOKING_STATUS.ADMIN2_APPROVED,
  BOOKING_STATUS.ADMIN3_APPROVED
];

const checkHallAvailability = async ({
  hallIds,
  eventDate,
  startTime,
  endTime
}) => {
  const conflicts = await Booking.find({
    halls: { $in: hallIds },
    eventDate: new Date(eventDate),
    status: { $in: BLOCKING_STATUSES },
    $expr: {
      $and: [
        { $lt: ["$startTime", endTime] },
        { $gt: ["$endTime", startTime] }
      ]
    }
  });

  return conflicts.length === 0;
};

module.exports = checkHallAvailability;
