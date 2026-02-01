import { useState, useEffect } from "react";
import { getMyBookings, updateBookingStatus } from "../../api/booking.api";
import BookingStatusBadge from "../../components/BookingStatusBadge";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    method: "UPI",
    transactionId: "",
    amount: ""
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await getMyBookings();
      setBookings(response.data);
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentClick = (booking) => {
    setSelectedBooking(booking);
    setPaymentDetails({
      method: "UPI",
      transactionId: "",
      amount: booking.totalAmount || ""
    });
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateBookingStatus(selectedBooking._id, "PAYMENT_COMPLETED");
      alert(`Payment of ₹${paymentDetails.amount} confirmed successfully!\nTransaction ID: ${paymentDetails.transactionId}`);
      setShowPaymentModal(false);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await updateBookingStatus(bookingId, "REJECTED");
      alert("Booking cancelled successfully!");
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div><p className="mt-2">Loading...</p></div>;
  if (error) return <div className="alert alert-danger"><i className="bi bi-exclamation-triangle"></i> {error}</div>;

  return (
    <div className="container">
      <h2 className="mb-4"><i className="bi bi-calendar-check"></i> My Bookings</h2>
      {bookings.length === 0 ? (
        <div className="alert alert-info">
          <p className="mb-0">No bookings found. <a href="/create-booking" className="alert-link">Create your first booking</a></p>
        </div>
      ) : (
        <>
          <div className="row g-3">
            {bookings.map((booking) => (
              <div key={booking._id} className="col-12">
                <div className="card shadow-sm" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                  <div className="card-body p-3 p-md-4">
                    <div className="row mb-3">
                      <div className="col-md-8">
                        <h4 className="mb-2" style={{ color: 'var(--text-primary)' }}>
                          {booking.halls && booking.halls.length > 0 
                            ? booking.halls.map(h => h.name).join(', ') 
                            : 'N/A'}
                        </h4>
                        <BookingStatusBadge status={booking.status} />
                      </div>
                      <div className="col-md-4 text-md-end mt-3 mt-md-0">
                        <small style={{ color: 'var(--text-secondary)' }} className="d-block">
                          <i className="bi bi-hash"></i> ID: {booking._id.slice(-6)}
                        </small>
                        <small style={{ color: 'var(--text-secondary)' }} className="d-block">
                          <i className="bi bi-calendar-event"></i> {new Date(booking.eventDate).toLocaleDateString()}
                        </small>
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      {booking.eventType && (
                        <div className="col-6 col-md-3">
                          <small style={{ color: 'var(--text-muted)' }} className="d-block mb-1">
                            <i className="bi bi-balloon"></i> Event Type
                          </small>
                          <strong style={{ color: 'var(--text-primary)' }}>{booking.eventType}</strong>
                        </div>
                      )}
                      {booking.numberOfGuests && (
                        <div className="col-6 col-md-3">
                          <small style={{ color: 'var(--text-muted)' }} className="d-block mb-1">
                            <i className="bi bi-people"></i> Guests
                          </small>
                          <strong style={{ color: 'var(--text-primary)' }}>{booking.numberOfGuests}</strong>
                        </div>
                      )}
                      <div className="col-6 col-md-3">
                        <small style={{ color: 'var(--text-muted)' }} className="d-block mb-1">
                          <i className="bi bi-clock"></i> Time
                        </small>
                        <strong style={{ color: 'var(--text-primary)' }}>{booking.startTime} - {booking.endTime}</strong>
                      </div>
                      <div className="col-6 col-md-3">
                        <small style={{ color: 'var(--text-muted)' }} className="d-block mb-1">
                          <i className="bi bi-currency-rupee"></i> Amount
                        </small>
                        <strong style={{ color: 'var(--success)', fontSize: '1.1rem' }}>
                          ₹{booking.totalAmount || 'Pending'}
                        </strong>
                      </div>
                    </div>

                    {booking.specialRequirements && (
                      <div className="mb-3 p-3 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                        <small style={{ color: 'var(--text-muted)' }} className="d-block mb-1 fw-bold">
                          <i className="bi bi-card-text"></i> Special Requirements
                        </small>
                        <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>{booking.specialRequirements}</p>
                      </div>
                    )}

                    {booking.adminComments && (
                      <div className="alert alert-warning mb-3">
                        <small className="d-block fw-bold mb-1">
                          <i className="bi bi-chat-square-text"></i> Admin Comments
                        </small>
                        <p className="mb-0">{booking.adminComments}</p>
                      </div>
                    )}

                    <div className="d-flex flex-wrap gap-2">
                      {booking.status === 'PAYMENT_REQUESTED' && (
                        <button
                          onClick={() => handlePaymentClick(booking)}
                          className="btn btn-success"
                        >
                          <i className="bi bi-credit-card"></i> Make Payment
                        </button>
                      )}
                      {['ACTION_PENDING', 'CHANGE_REQUESTED'].includes(booking.status) && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="btn btn-danger"
                        >
                          <i className="bi bi-x-circle"></i> Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Modal */}
          {showPaymentModal && (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowPaymentModal(false)}>
              <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                  <div className="modal-header" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <h5 className="modal-title" style={{ color: 'var(--text-primary)' }}>
                      <i className="bi bi-credit-card"></i> Payment Details
                    </h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowPaymentModal(false)}></button>
                  </div>
                  <form onSubmit={handlePaymentSubmit}>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label"><i className="bi bi-building"></i> Hall</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={selectedBooking?.halls?.[0]?.name || 'N/A'} 
                          disabled 
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label"><i className="bi bi-currency-rupee"></i> Amount</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          value={paymentDetails.amount}
                          onChange={(e) => setPaymentDetails({...paymentDetails, amount: e.target.value})}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label"><i className="bi bi-wallet2"></i> Payment Method</label>
                        <select 
                          className="form-select"
                          value={paymentDetails.method}
                          onChange={(e) => setPaymentDetails({...paymentDetails, method: e.target.value})}
                        >
                          <option value="UPI">UPI</option>
                          <option value="Card">Credit/Debit Card</option>
                          <option value="Net Banking">Net Banking</option>
                          <option value="Cash">Cash</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label"><i className="bi bi-receipt"></i> Transaction ID</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Enter transaction/reference ID"
                          value={paymentDetails.transactionId}
                          onChange={(e) => setPaymentDetails({...paymentDetails, transactionId: e.target.value})}
                          required
                        />
                      </div>
                      <div className="alert alert-info">
                        <small>
                          <i className="bi bi-info-circle"></i> Please complete the payment through your selected method and enter the transaction ID here.
                        </small>
                      </div>
                    </div>
                    <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)' }}>
                      <button type="button" className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-success">
                        <i className="bi bi-check-circle"></i> Confirm Payment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
