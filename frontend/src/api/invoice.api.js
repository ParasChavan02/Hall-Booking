import api from "./axios";

export const getMyInvoices = () =>
  api.get("/invoices/my");

export const downloadInvoice = (bookingId) =>
  window.open(
    `http://localhost:5000/api/invoices/download/${bookingId}`,
    "_blank"
  );
