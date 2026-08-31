import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginStudent } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginStudent({ email, password });
      if (res.success) {
        navigate('/student/dashboard');
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please check email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="text-center mb-4">
          <div className="stat-icon primary mx-auto mb-3">
            <LogIn size={28} />
          </div>
          <h4 className="fw-bold">Student Portal Login</h4>
          <p className="text-secondary fs-sm">Sign in to cast your vote in active elections</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 py-2 px-3 fs-sm" role="alert">
            <AlertCircle size={18} className="flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold fs-sm">Student Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Mail size={18} className="text-muted" />
              </span>
              <input
                type="email"
                className="form-control bg-light border-start-0"
                placeholder="name@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold fs-sm">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Lock size={18} className="text-muted" />
              </span>
              <input
                type="password"
                className="form-control bg-light border-start-0"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 rounded-3 fw-bold"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            ) : null}
            Sign In
          </button>
        </form>

        <div className="text-center mt-4 border-top pt-3">
          <p className="text-secondary fs-sm mb-1">
            Don't have a student account?{' '}
            <Link to="/register" className="fw-bold text-primary text-decoration-none">
              Register here
            </Link>
          </p>
          <p className="text-muted fs-xs mb-0">
            Are you an Election Official?{' '}
            <Link to="/admin/login" className="fw-semibold text-secondary">
              Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
