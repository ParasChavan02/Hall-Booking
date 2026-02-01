import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CreateBooking from './pages/user/CreateBooking';
import MyBookings from './pages/user/MyBookings';
import MyInvoices from './pages/user/MyInvoices';
import HallGallery from './pages/user/HallGallery';
import AdminDashboard from './pages/admin/AdminDashboard';
import BookingReview from './pages/admin/BookingReview';
import Reports from './pages/admin/Reports';
import './App.css';

function Navigation() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ 
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
      marginBottom: '2rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
    }}>
      <div className="container-fluid" style={{ maxWidth: '1400px' }}>
        <Link to="/" className="navbar-brand" style={{ 
          fontWeight: '700', 
          fontSize: '1.35rem',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.025em'
        }}>
          🏛️ <span className="d-none d-sm-inline">Banquet Hall Booking</span><span className="d-inline d-sm-none">BHB</span>
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-controls="navbarNav" 
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          {user ? (
            <>
              <ul className="navbar-nav me-auto">
                {user.role === 'user' && (
                  <>
                    <li className="nav-item">
                      <Link to="/halls" className="nav-link">
                        <i className="bi bi-arrow-repeat"></i> <span className="d-lg-none d-inline">Explore </span>Halls
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/create-booking" className="nav-link">
                        <i className="bi bi-plus-circle"></i> <span className="d-lg-none d-inline">Create </span>Booking
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/my-bookings" className="nav-link">
                        <i className="bi bi-calendar-check"></i> <span className="d-lg-none d-inline">My </span>Bookings
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/my-invoices" className="nav-link">
                        <i className="bi bi-receipt"></i> <span className="d-lg-none d-inline">My </span>Invoices
                      </Link>
                    </li>
                  </>
                )}
                {user.role === 'admin' && (
                  <>
                    <li className="nav-item">
                      <Link to="/admin" className="nav-link">
                        <i className="bi bi-speedometer2"></i> Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/admin/review" className="nav-link">
                        <i className="bi bi-clipboard-check"></i> Review
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/admin/reports" className="nav-link">
                        <i className="bi bi-graph-up"></i> Reports
                      </Link>
                    </li>
                  </>
                )}
              </ul>
              <div className="d-flex align-items-center gap-2 flex-wrap mt-2 mt-lg-0">
                <span className="small" style={{ color: 'var(--text-secondary)' }}>
                  Welcome, <strong style={{ color: 'var(--accent-primary)' }}>{user.role === 'admin' ? 'Admin' : 'User'}</strong>
                </span>
                <button onClick={logout} className="btn btn-outline-light btn-sm">
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </div>
            </>
          ) : (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  <i className="bi bi-box-arrow-in-right"></i> Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="btn btn-primary btn-sm ms-2">
                  <i className="bi bi-person-plus"></i> Register
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <div style={{ padding: '0 2rem' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* User Routes */}
            <Route 
              path="/create-booking" 
              element={
                <ProtectedRoute roles={['user']}>
                  <CreateBooking />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/halls" 
              element={
                <ProtectedRoute roles={['user']}>
                  <HallGallery />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-bookings" 
              element={
                <ProtectedRoute roles={['user']}>
                  <MyBookings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-invoices" 
              element={
                <ProtectedRoute roles={['user']}>
                  <MyInvoices />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/review" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <BookingReview />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <Reports />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
