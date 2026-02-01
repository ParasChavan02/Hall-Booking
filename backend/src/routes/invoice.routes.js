const express = require("express");
const Invoice = require("../models/Invoice");
const Booking = require("../models/Booking");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const generateInvoicePDF = require("../utils/generateInvoicePDF");

const router = express.Router();

router.get("/my", authMiddleware, async (req, res) => {
  const invoices = await Invoice.find({ userId: req.user.userId });
  res.json(invoices);
});

router.get("/download/:bookingId", authMiddleware, async (req, res) => {
  const invoice = await Invoice.findOne({ bookingId: req.params.bookingId });
  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  const booking = await Booking.findById(invoice.bookingId);
  const user = await User.findById(invoice.userId);

  generateInvoicePDF(invoice, booking, user, res);
});

module.exports = router;
