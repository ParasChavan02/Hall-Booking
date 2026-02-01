const PDFDocument = require("pdfkit");

const generateInvoicePDF = (invoice, booking, user, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${invoice._id}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(20).text("Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(12);
  doc.text(`Invoice ID: ${invoice._id}`);
  doc.text(`Issued At: ${invoice.issuedAt.toDateString()}`);
  doc.moveDown();

  doc.text(`Customer: ${user.name}`);
  doc.text(`Email: ${user.email}`);
  doc.moveDown();

  doc.text(`Booking ID: ${booking._id}`);
  doc.text(`Event Date: ${booking.eventDate.toDateString()}`);
  doc.text(`Time: ${booking.startTime} - ${booking.endTime}`);
  doc.moveDown();

  doc.text(`Amount Paid: ₹${invoice.amount}`);
  doc.text(`Payment Method: ${invoice.paymentMethod}`);
  doc.moveDown();

  doc.text("Thank you for booking with us!", { align: "center" });

  doc.end();
};

module.exports = generateInvoicePDF;
