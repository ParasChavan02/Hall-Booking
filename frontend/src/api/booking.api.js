import api from "./axios";

export const createBooking = (data) =>
  api.post("/bookings", data);

export const getMyBookings = () =>
  api.get("/bookings/my");

export const getAllBookings = () =>
  api.get("/bookings");

export const getBookingById = (id) =>
  api.get(`/bookings/${id}`);

export const updateBookingStatus = (id, nextStatus) =>
  api.post(`/bookings/${id}/status`, { nextStatus });

export const getAvailableHalls = () =>
  api.get("/admin/halls");
