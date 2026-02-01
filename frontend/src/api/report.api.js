import api from "./axios";

export const getRevenueReport = () =>
  api.get("/reports/revenue");

export const getBookingStats = () =>
  api.get("/reports/booking-status");
