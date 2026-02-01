import { useState, useEffect } from "react";
import { getAllBookings } from "../../api/booking.api";
import BookingStatusBadge from "../../components/BookingStatusBadge";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await getAllBookings();
      const bookingsData = response.data;
      setBookings(bookingsData);

      // Calculate stats
      const stats = {
        total: bookingsData.length,
        pending: bookingsData.filter(b => b.status === 'ACTION_PENDING').length,
        approved: bookingsData.filter(b => ['ADMIN1_APPROVED', 'ADMIN2_APPROVED', 'ADMIN3_APPROVED'].includes(b.status)).length,
        rejected: bookingsData.filter(b => b.status === 'REJECTED').length
      };
      setStats(stats);
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', backgroundColor: '#007bff', color: 'white', borderRadius: '0.5rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.total}</div>
          <div>Total Bookings</div>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: '#ffa500', color: 'white', borderRadius: '0.5rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.pending}</div>
          <div>Pending Review</div>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: '#28a745', color: 'white', borderRadius: '0.5rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.approved}</div>
          <div>Approved</div>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: '#dc3545', color: 'white', borderRadius: '0.5rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.rejected}</div>
          <div>Rejected</div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Recent Bookings</h3>
        <Link to="/admin/review">
          <button style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}>
            Review All Bookings
          </button>
        </Link>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {bookings.slice(0, 5).map((booking) => (
          <div
            key={booking._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              backgroundColor: '#f9f9f9'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{booking.hall?.name || 'N/A'}</h4>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                  User: {booking.user?.name || 'N/A'} ({booking.user?.email || 'N/A'})
                </div>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                  Event Date: {new Date(booking.eventDate).toLocaleDateString()}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                  Guests: {booking.numberOfGuests}
                </div>
              </div>
              <BookingStatusBadge status={booking.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
