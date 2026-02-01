import { useState, useEffect } from "react";
import { createBooking, getAvailableHalls } from "../../api/booking.api";
import { useNavigate } from "react-router-dom";

export default function CreateBooking() {
  const [halls, setHalls] = useState([]);
  const [formData, setFormData] = useState({
    hallId: "",
    eventDate: "",
    startTime: "09:00",
    endTime: "18:00",
    eventType: "",
    numberOfGuests: "",
    specialRequirements: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      const response = await getAvailableHalls();
      setHalls(response.data);
      setError(""); // Clear error on success
    } catch (err) {
      console.error("Error loading halls:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to load halls";
      setError(errorMessage);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createBooking({
        ...formData,
        numberOfGuests: parseInt(formData.numberOfGuests)
      });
      alert("Booking created successfully!");
      navigate("/my-bookings");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '700px' }}>
      <div className="mb-4">
        <h2 className="mb-2">🎉 Create New Booking</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Fill in the details below to reserve your perfect venue
        </p>
      </div>
      
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <span>{error}</span>
        </div>
      )}
      
      <div className="card p-3 p-md-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label"><i className="bi bi-building"></i> Select Hall</label>
            <select
              name="hallId"
              value={formData.hallId}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Choose a venue...</option>
              {halls.map((hall) => (
                <option key={hall._id} value={hall._id}>
                  {hall.name} • Capacity: {hall.capacity} guests
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label"><i className="bi bi-calendar-event"></i> Event Date</label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
              className="form-control"
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label"><i className="bi bi-clock"></i> Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="col-6">
              <label className="form-label"><i className="bi bi-clock-fill"></i> End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label"><i className="bi bi-balloon"></i> Event Type</label>
            <input
              type="text"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              placeholder="Wedding, Birthday, Conference..."
              required
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label"><i className="bi bi-people-fill"></i> Number of Guests</label>
            <input
              type="number"
              name="numberOfGuests"
              value={formData.numberOfGuests}
              onChange={handleChange}
              min="1"
              required
              placeholder="Expected number of attendees"
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label"><i className="bi bi-card-text"></i> Special Requirements (Optional)</label>
            <textarea
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={handleChange}
              rows="4"
              placeholder="Any specific requirements or requests..."
              className="form-control"
              style={{ resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-success btn-lg w-100"
          >
            {loading ? (
              <><i className="bi bi-hourglass-split"></i> Creating Booking...</>
            ) : (
              <><i className="bi bi-stars"></i> Create Booking</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
