import { useState, useEffect } from "react";
import { getAllBookings, updateBookingStatus } from "../../api/booking.api";
import BookingStatusBadge from "../../components/BookingStatusBadge";

export default function BookingReview() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await getAllBookings();
      setBookings(response.data);
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, nextStatus) => {
    try {
      await updateBookingStatus(bookingId, nextStatus);
      alert("Booking status updated successfully!");
      setSelectedBooking(null);
      setComments("");
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const getAvailableActions = (status) => {
    const actions = [];
    
    switch (status) {
      case 'ACTION_PENDING':
        actions.push({ label: 'Approve (Level 1)', value: 'ADMIN1_APPROVED', color: '#17a2b8' });
        actions.push({ label: 'Request Changes', value: 'CHANGE_REQUESTED', color: '#ff6b6b' });
        actions.push({ label: 'Reject', value: 'REJECTED', color: '#dc3545' });
        break;
      case 'CHANGE_REQUESTED':
        actions.push({ label: 'Approve (Level 1)', value: 'ADMIN1_APPROVED', color: '#17a2b8' });
        actions.push({ label: 'Reject', value: 'REJECTED', color: '#dc3545' });
        break;
      case 'ADMIN1_APPROVED':
        actions.push({ label: 'Request Payment', value: 'PAYMENT_REQUESTED', color: '#ffc107' });
        actions.push({ label: 'Reject', value: 'REJECTED', color: '#dc3545' });
        break;
      case 'PAYMENT_COMPLETED':
        actions.push({ label: 'Approve (Level 2)', value: 'ADMIN2_APPROVED', color: '#20c997' });
        actions.push({ label: 'Reject', value: 'REJECTED', color: '#dc3545' });
        break;
      case 'ADMIN2_APPROVED':
        actions.push({ label: 'Final Approval (Level 3)', value: 'ADMIN3_APPROVED', color: '#28a745' });
        actions.push({ label: 'Reject', value: 'REJECTED', color: '#dc3545' });
        break;
      default:
        break;
    }
    
    return actions;
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === "all") return true;
    if (filter === "pending") return booking.status === "ACTION_PENDING";
    if (filter === "approved") return ["ADMIN1_APPROVED", "ADMIN2_APPROVED", "ADMIN3_APPROVED"].includes(booking.status);
    if (filter === "rejected") return booking.status === "REJECTED";
    return true;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Review Bookings</h2>

      {/* Filter Buttons */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => setFilter("all")}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: filter === "all" ? '#007bff' : '#e9ecef',
            color: filter === "all" ? 'white' : '#000',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        >
          All ({bookings.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: filter === "pending" ? '#ffa500' : '#e9ecef',
            color: filter === "pending" ? 'white' : '#000',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        >
          Pending ({bookings.filter(b => b.status === "ACTION_PENDING").length})
        </button>
        <button
          onClick={() => setFilter("approved")}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: filter === "approved" ? '#28a745' : '#e9ecef',
            color: filter === "approved" ? 'white' : '#000',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        >
          Approved ({bookings.filter(b => ["ADMIN1_APPROVED", "ADMIN2_APPROVED", "ADMIN3_APPROVED"].includes(b.status)).length})
        </button>
        <button
          onClick={() => setFilter("rejected")}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: filter === "rejected" ? '#dc3545' : '#e9ecef',
            color: filter === "rejected" ? 'white' : '#000',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        >
          Rejected ({bookings.filter(b => b.status === "REJECTED").length})
        </button>
      </div>

      {/* Bookings List */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {filteredBookings.map((booking) => (
          <div
            key={booking._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              backgroundColor: '#f9f9f9'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{booking.hall?.name || 'N/A'}</h3>
                <BookingStatusBadge status={booking.status} />
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#666' }}>
                <div>ID: {booking._id.slice(-6)}</div>
                <div>Created: {new Date(booking.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <strong>User:</strong> {booking.user?.name || 'N/A'}
                <div style={{ fontSize: '0.875rem', color: '#666' }}>{booking.user?.email || 'N/A'}</div>
              </div>
              <div>
                <strong>Event Date:</strong> {new Date(booking.eventDate).toLocaleDateString()}
              </div>
              <div>
                <strong>Event Type:</strong> {booking.eventType}
              </div>
              <div>
                <strong>Guests:</strong> {booking.numberOfGuests}
              </div>
              <div>
                <strong>Amount:</strong> ₹{booking.totalAmount || 'N/A'}
              </div>
            </div>

            {booking.specialRequirements && (
              <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#e7f3ff', borderRadius: '0.25rem' }}>
                <strong>Special Requirements:</strong>
                <p style={{ margin: '0.5rem 0 0 0' }}>{booking.specialRequirements}</p>
              </div>
            )}

            {booking.adminComments && (
              <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fff3cd', borderRadius: '0.25rem' }}>
                <strong>Admin Comments:</strong>
                <p style={{ margin: '0.5rem 0 0 0' }}>{booking.adminComments}</p>
              </div>
            )}

            {/* Action Buttons */}
            {getAvailableActions(booking.status).length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                {getAvailableActions(booking.status).map((action) => (
                  <button
                    key={action.value}
                    onClick={() => {
                      if (window.confirm(`Confirm action: ${action.label}?`)) {
                        handleStatusUpdate(booking._id, action.value);
                      }
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: action.color,
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
          No bookings found for the selected filter.
        </p>
      )}
    </div>
  );
}
