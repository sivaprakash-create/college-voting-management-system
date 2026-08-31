import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Vote, LogOut, User, ShieldCheck, LayoutDashboard, ChevronDown, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  // Close menus on page navigation
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container-fluid px-3 px-md-4">
        {/* Brand Logo */}
        <Link className="navbar-brand" to="/">
          <Vote className="text-primary" size={28} />
          <span>CampusVote</span>
        </Link>

        {/* Mobile Toggler */}
        <button
          className="navbar-toggler border-0 shadow-none p-1"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navbar Content */}
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`} id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/">
                Home
              </Link>
            </li>
            {isStudent && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/student/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/candidates">
                    Candidates
                  </Link>
                </li>
              </>
            )}
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link fw-semibold d-flex align-items-center gap-1" to="/admin/dashboard">
                  <LayoutDashboard size={18} /> Admin Dashboard
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center flex-wrap gap-2 pt-2 pt-lg-0">
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2 flex-wrap">
                {/* User Dropdown */}
                <div className="dropdown position-relative" ref={dropdownRef}>
                  <button
                    className="btn btn-outline-secondary d-flex align-items-center gap-2 rounded-pill px-3 py-1.5"
                    type="button"
                    id="userDropdown"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-expanded={dropdownOpen}
                  >
                    {isAdmin ? <ShieldCheck size={18} className="text-primary" /> : <User size={18} className="text-primary" />}
                    <span className="fw-semibold text-truncate" style={{ maxWidth: '140px' }}>
                      {user?.name || 'User'}
                    </span>
                    <span className={`badge rounded-pill text-uppercase fs-xs ms-1 ${isAdmin ? 'bg-danger' : 'bg-primary'}`}>
                      {user?.role}
                    </span>
                    <ChevronDown size={14} className={`text-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div
                      className="dropdown-menu dropdown-menu-end show shadow border-0 mt-2 p-2 rounded-3"
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        minWidth: '240px',
                        zIndex: 1050,
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <div className="px-3 py-2 border-bottom mb-1 bg-light rounded-2">
                        <p className="fw-bold text-dark mb-0 small">{user?.name}</p>
                        <p className="text-muted fs-xs mb-0 text-truncate">{user?.email}</p>
                        {user?.department && (
                          <p className="text-secondary fs-xs mb-0 mt-1">
                            {user.department} {user.year ? `• ${user.year}` : ''}
                          </p>
                        )}
                      </div>

                      {isStudent && (
                        <>
                          <Link className="dropdown-item rounded-2 py-2 fs-sm d-flex align-items-center gap-2" to="/student/dashboard">
                            <Vote size={16} className="text-primary" /> Student Portal
                          </Link>
                          <Link className="dropdown-item rounded-2 py-2 fs-sm d-flex align-items-center gap-2" to="/candidates">
                            <User size={16} className="text-secondary" /> Browse Candidates
                          </Link>
                        </>
                      )}

                      {isAdmin && (
                        <Link className="dropdown-item rounded-2 py-2 fs-sm d-flex align-items-center gap-2" to="/admin/dashboard">
                          <LayoutDashboard size={16} className="text-primary" /> Admin Portal
                        </Link>
                      )}

                      <div className="border-top my-1"></div>

                      <button
                        className="dropdown-item rounded-2 py-2 fs-sm text-danger d-flex align-items-center gap-2 fw-semibold"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  )}
                </div>

                {/* Direct Visible Logout Button */}
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1.5 d-flex align-items-center gap-1.5 fw-semibold"
                  title="Sign out of your account"
                >
                  <LogOut size={15} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1.5">
                  Student Login
                </Link>
                <Link to="/admin/login" className="btn btn-primary btn-sm rounded-pill px-3 py-1.5">
                  Admin Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
