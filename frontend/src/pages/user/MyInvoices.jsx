import { useState, useEffect } from "react";
import { getMyInvoices, downloadInvoice } from "../../api/invoice.api";

export default function MyInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await getMyInvoices();
      setInvoices(response.data);
    } catch (err) {
      setError("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>My Invoices</h2>
      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {invoices.map((invoice) => (
            <div
              key={invoice._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                backgroundColor: '#f9f9f9'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>Invoice #{invoice.invoiceNumber}</h3>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                    Date: {new Date(invoice.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                    ₹{invoice.totalAmount}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <strong>Booking Details:</strong>
                <div style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                  <div>Hall: {invoice.booking?.hall?.name || 'N/A'}</div>
                  <div>Event Date: {invoice.booking?.eventDate ? new Date(invoice.booking.eventDate).toLocaleDateString() : 'N/A'}</div>
                  <div>Event Type: {invoice.booking?.eventType || 'N/A'}</div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <strong>Amount Breakdown:</strong>
                <div style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                  <div>Subtotal: ₹{invoice.subtotal}</div>
                  <div>Tax ({invoice.taxPercentage}%): ₹{invoice.taxAmount}</div>
                  <div style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>
                    Total: ₹{invoice.totalAmount}
                  </div>
                </div>
              </div>

              <button
                onClick={() => downloadInvoice(invoice.booking._id)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer'
                }}
              >
                Download PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
