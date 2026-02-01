import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      const token = res.data.token;
      const payload = JSON.parse(atob(token.split(".")[1]));

      // Map backend roles to frontend roles
      const frontendRole = payload.role === 'USER' ? 'user' : 'admin';
      login(token, { role: frontendRole, email: payload.email, backendRole: payload.role });
      
      // Navigate based on role
      if (frontendRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/my-bookings');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '450px', marginTop: '3rem' }}>
      <div className="card shadow-lg" style={{ 
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '1rem'
      }}>
        <div className="card-body p-4 p-md-5">
          <h2 className="text-center mb-2">Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Sign in to your account to continue
          </p>
          
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label"><i className="bi bi-envelope"></i> Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="form-control"
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label"><i className="bi bi-lock"></i> Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="form-control"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-100 mt-2"
            >
              {loading ? (
                <><i className="bi bi-hourglass-split"></i> Signing in...</>
              ) : (
                <><i className="bi bi-box-arrow-in-right"></i> Sign In</>
              )}
            </button>
          </form>
          
          <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
