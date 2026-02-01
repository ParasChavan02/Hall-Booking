import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAvailableHalls } from "../../api/booking.api";
import Hall360View from "../../components/Hall360View";

export default function HallGallery() {
  const [halls, setHalls] = useState([]);
  const [selectedHall, setSelectedHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      const response = await getAvailableHalls();
      setHalls(response.data);
      if (response.data.length > 0) {
        setSelectedHall(response.data[0]);
      }
    } catch (err) {
      setError("Failed to load halls");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    navigate('/create-booking');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
        <p>Loading halls...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>⚠️</span>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="container-fluid" style={{ maxWidth: '1400px' }}>
      <div className="mb-4">
        <h2 className="mb-2">🏛️ Explore Our Banquet Halls</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Experience our venues with interactive 360° views
        </p>
      </div>

      {halls.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏛️</div>
          <h3>No Halls Available</h3>
          <p style={{ color: 'var(--text-muted)' }}>Please check back later</p>
        </div>
      ) : (
        <div className="row g-3">
          {/* Main 360 View */}
          <div className="col-lg-8 col-12">
            <div style={{ height: '400px', marginBottom: '1rem' }} className="d-none d-md-block">
              <Hall360View 
                panoramaUrl={selectedHall?.panoramaUrl} 
                hallName={selectedHall?.name}
              />
            </div>
            <div style={{ height: '250px', marginBottom: '1rem' }} className="d-block d-md-none">
              <Hall360View 
                panoramaUrl={selectedHall?.panoramaUrl} 
                hallName={selectedHall?.name}
              />
            </div>

            {/* Selected Hall Details */}
            {selectedHall && (
              <div className="card" style={{ padding: '1.5rem' }}>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
                  <div className="mb-3 mb-md-0">
                    <h2 className="mb-2">{selectedHall.name}</h2>
                    <div className="d-flex flex-wrap gap-3" style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                      <span><i className="bi bi-people"></i> {selectedHall.capacity} guests</span>
                      {selectedHall.pricePerHour > 0 && (
                        <span><i className="bi bi-currency-rupee"></i>{selectedHall.pricePerHour}/hour</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleBookNow}
                    className="btn btn-primary w-100 w-md-auto"
                  >
                    <i className="bi bi-calendar-check"></i> Book Now
                  </button>
                </div>

                {selectedHall.description && (
                  <div className="mb-3">
                    <h5 className="mb-2"><i className="bi bi-card-text"></i> Description</h5>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                      {selectedHall.description}
                    </p>
                  </div>
                )}

                {selectedHall.amenities && selectedHall.amenities.length > 0 && (
                  <div className="mb-3">
                    <h5 className="mb-2"><i className="bi bi-stars"></i> Amenities</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {selectedHall.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="badge"
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            color: 'var(--accent-primary)'
                          }}
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedHall.images && selectedHall.images.length > 0 && (
                  <div>
                    <h5 className="mb-2"><i className="bi bi-images"></i> Gallery</h5>
                    <div className="row g-2">
                      {selectedHall.images.map((image, index) => (
                        <div key={index} className="col-6 col-md-4 col-lg-3">
                          <img
                            src={image}
                            alt={`${selectedHall.name} - ${index + 1}`}
                            className="img-fluid rounded"
                            style={{
                              height: '120px',
                              width: '100%',
                              objectFit: 'cover',
                              border: '1px solid var(--border-color)'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hall List Sidebar */}
          <div className="col-lg-4 col-12">
            <div className="card" style={{ padding: '1rem' }}>
              <h4 className="mb-3" style={{ color: 'var(--text-primary)' }}>
                <i className="bi bi-building"></i> All Halls
              </h4>
              <div className="d-flex flex-column gap-2">
                {halls.map((hall) => (
                  <div
                    key={hall._id}
                    onClick={() => setSelectedHall(hall)}
                    className="p-3 rounded"
                    style={{
                      cursor: 'pointer',
                      border: selectedHall?._id === hall._id 
                        ? '2px solid var(--accent-primary)' 
                        : '1px solid var(--border-color)',
                      backgroundColor: selectedHall?._id === hall._id 
                        ? 'rgba(59, 130, 246, 0.1)' 
                        : 'transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <h5 className="mb-2" style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                      {hall.name}
                    </h5>
                    <div className="small" style={{ color: 'var(--text-secondary)' }}>
                      <div className="mb-1">
                        <i className="bi bi-people"></i> <strong>{hall.capacity}</strong> guests
                      </div>
                      {hall.pricePerHour > 0 && (
                        <div className="mb-1">
                          <i className="bi bi-currency-rupee"></i> <strong>₹{hall.pricePerHour}</strong>/hour
                        </div>
                      )}
                    </div>
                    {hall.panoramaUrl && (
                      <div className="mt-2 d-flex align-items-center gap-1" style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--accent-primary)'
                      }}>
                        <i className="bi bi-arrow-repeat"></i>
                        <span>360° View Available</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
