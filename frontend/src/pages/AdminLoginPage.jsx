import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, AlertCircle } from 'lucide-react';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginAdmin({ email, password });
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.message || 'Admin authentication failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ borderTop: '4px solid #1e3a8a' }}>
        <div className="text-center mb-4">
          <div className="stat-icon primary mx-auto mb-3">
            <ShieldCheck size={32} />
          </div>
          <h4 className="fw-bold">Administrator Portal</h4>
          <p className="text-secondary fs-sm">Sign in to manage elections, students, and results</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 py-2 px-3 fs-sm" role="alert">
            <AlertCircle size={18} className="flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold fs-sm">Admin Email</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Mail size={18} className="text-muted" />
              </span>
              <input
                type="email"
                className="form-control bg-light border-start-0"
                placeholder="admin@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold fs-sm">Admin Master Password</label>
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
            Access Admin Control Center
          </button>
        </form>

        <div className="text-center mt-4 border-top pt-3">
          <p className="text-muted fs-xs mb-0">
            Student user?{' '}
            <Link to="/login" className="fw-bold text-primary text-decoration-none">
              Go to Student Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
