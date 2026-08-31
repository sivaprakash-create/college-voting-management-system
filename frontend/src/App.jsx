import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import CandidateListPage from './pages/CandidateListPage';
import ResultsPage from './pages/ResultsPage';

// Student Portal Pages
import StudentDashboard from './pages/StudentDashboard';
import VotingPage from './pages/VotingPage';
import VoteConfirmationPage from './pages/VoteConfirmationPage';

// Admin Portal Pages
import AdminDashboard from './pages/AdminDashboard';
import ManageStudentsPage from './pages/ManageStudentsPage';
import ManageCandidatesPage from './pages/ManageCandidatesPage';
import ManageElectionsPage from './pages/ManageElectionsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100 bg-light">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/candidates" element={<CandidateListPage />} />
              <Route path="/results/:electionId" element={<ResultsPage />} />

              {/* Student Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/vote/:electionId" element={<VotingPage />} />
                <Route path="/vote-confirmation" element={<VoteConfirmationPage />} />
              </Route>

              {/* Admin Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/students" element={<ManageStudentsPage />} />
                <Route path="/admin/candidates" element={<ManageCandidatesPage />} />
                <Route path="/admin/elections" element={<ManageElectionsPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </main>
          
          <footer className="bg-white border-top py-3 text-center text-muted fs-xs mt-auto">
            <div className="container">
              © {new Date().getFullYear()} CampusVote - College Online Voting System. Built with MERN Stack.
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
