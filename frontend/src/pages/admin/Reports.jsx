import { useState, useEffect } from "react";
import { getRevenueReport, getBookingStats } from "../../api/report.api";

export default function Reports() {
  const [revenueData, setRevenueData] = useState(null);
  const [bookingStats, setBookingStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [revenueRes, statsRes] = await Promise.all([
        getRevenueReport(),
        getBookingStats()
      ]);
      setRevenueData(revenueRes.data);
      setBookingStats(statsRes.data);
    } catch (err) {
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Reports & Analytics</h2>

      {/* Revenue Report */}
      <div style={{ marginBottom: '3rem' }}>
        <h3>Revenue Report</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#28a745',
            color: 'white',
            borderRadius: '0.5rem'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              ₹{revenueData?.totalRevenue?.toLocaleString() || 0}
            </div>
            <div>Total Revenue</div>
          </div>
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#17a2b8',
            color: 'white',
            borderRadius: '0.5rem'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {revenueData?.totalBookings || 0}
            </div>
            <div>Total Bookings</div>
          </div>
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#ffc107',
            color: 'white',
            borderRadius: '0.5rem'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              ₹{revenueData?.averageBookingValue?.toFixed(2) || 0}
            </div>
            <div>Average Booking Value</div>
          </div>
        </div>
      </div>

      {/* Booking Statistics by Status */}
      <div>
        <h3>Booking Statistics by Status</h3>
        <div style={{
          marginTop: '1rem',
          border: '1px solid #ddd',
          borderRadius: '0.5rem',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                  Status
                </th>
                <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #ddd' }}>
                  Count
                </th>
                <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #ddd' }}>
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody>
              {bookingStats.map((stat, index) => (
                <tr key={stat._id} style={{
                  backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa'
                }}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                    {stat._id.replace(/_/g, ' ')}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', borderBottom: '1px solid #ddd' }}>
                    {stat.count}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', borderBottom: '1px solid #ddd' }}>
                    {stat.percentage?.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {bookingStats.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
            No booking statistics available.
          </p>
        )}
      </div>

      {/* Monthly Revenue Chart Placeholder */}
      <div style={{ marginTop: '3rem' }}>
        <h3>Monthly Trend</h3>
        <div style={{
          padding: '3rem',
          border: '2px dashed #ddd',
          borderRadius: '0.5rem',
          textAlign: 'center',
          color: '#666',
          marginTop: '1rem'
        }}>
          <p>Chart visualization can be added here using libraries like Chart.js or Recharts</p>
          <p style={{ fontSize: '0.875rem', marginTop: '1rem' }}>
            Consider adding: Revenue trends, Booking trends, Hall utilization rates
          </p>
        </div>
      </div>
    </div>
  );
}
