import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, Vote, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className="sidebar">
      <div className="px-4 mb-4">
        <h6 className="text-uppercase text-secondary fs-xs fw-bold tracking-wider mb-2">
          Admin Portal
        </h6>
        <div className="border-bottom border-secondary opacity-25"></div>
      </div>

      <nav className="nav flex-column">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/students"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Users size={20} />
          <span>Manage Students</span>
        </NavLink>

        <NavLink
          to="/admin/candidates"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <UserCheck size={20} />
          <span>Manage Candidates</span>
        </NavLink>

        <NavLink
          to="/admin/elections"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Vote size={20} />
          <span>Manage Elections</span>
        </NavLink>
      </nav>

      <div className="px-4 mt-auto pt-5">
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 rounded-3 py-2 fw-semibold"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
