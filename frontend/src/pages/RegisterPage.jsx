import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Hash, BookOpen, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Computer Science',
    year: '1st Year',
    rollNumber: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerStudent } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      const res = await registerStudent({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        year: formData.year,
        rollNumber: formData.rollNumber
      });

      if (res.success) {
        navigate('/student/dashboard');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error registering student account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper py-5">
      <div className="auth-card" style={{ maxWidth: '580px' }}>
        <div className="text-center mb-4">
          <div className="stat-icon primary mx-auto mb-3">
            <UserPlus size={28} />
          </div>
          <h4 className="fw-bold">Student Registration</h4>
          <p className="text-secondary fs-sm">Create an account to vote in college elections</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 py-2 px-3 fs-sm mb-4" role="alert">
            <AlertCircle size={18} className="flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-12">
              <label className="form-label fw-semibold fs-sm">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <User size={18} className="text-muted" />
                </span>
                <input
                  type="text"
                  name="name"
                  className="form-control bg-light border-start-0"
                  placeholder="e.g. Aarav Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold fs-sm">Student Email</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Mail size={18} className="text-muted" />
                </span>
                <input
                  type="email"
                  name="email"
                  className="form-control bg-light border-start-0"
                  placeholder="aarav@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold fs-sm">Roll Number</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Hash size={18} className="text-muted" />
                </span>
                <input
                  type="text"
                  name="rollNumber"
                  className="form-control bg-light border-start-0"
                  placeholder="e.g. CS2026-042"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold fs-sm">Department</label>
              <select
                name="department"
                className="form-select bg-light"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Business Administration">Business Administration</option>
                <option value="Biotechnology">Biotechnology</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold fs-sm">Academic Year</label>
              <select
                name="year"
                className="form-select bg-light"
                value={formData.year}
                onChange={handleChange}
                required
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold fs-sm">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Lock size={18} className="text-muted" />
                </span>
                <input
                  type="password"
                  name="password"
                  className="form-control bg-light border-start-0"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold fs-sm">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Lock size={18} className="text-muted" />
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control bg-light border-start-0"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 rounded-3 fw-bold mt-4"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            ) : null}
            Complete Registration
          </button>
        </form>

        <div className="text-center mt-4 border-top pt-3">
          <p className="text-secondary fs-sm mb-0">
            Already registered?{' '}
            <Link to="/login" className="fw-bold text-primary text-decoration-none">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
