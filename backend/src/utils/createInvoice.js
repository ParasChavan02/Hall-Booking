const Invoice = require("../models/Invoice");

const createInvoice = async ({ booking }) => {
  return await Invoice.create({
    bookingId: booking._id,
    userId: booking.userId,
    amount: booking.totalAmount || 0
  });
};

module.exports = createInvoice;
