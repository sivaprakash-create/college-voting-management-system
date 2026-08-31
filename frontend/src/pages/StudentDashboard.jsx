import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import electionService from '../services/electionService';
import voteService from '../services/voteService';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Vote, CheckCircle2, Award, Clock, ArrowRight, LogOut } from 'lucide-react';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [votedElectionsMap, setVotedElectionsMap] = useState({});
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await electionService.getAllElections();
        if (data.success) {
          setElections(data.elections);

          // Check vote status for each election
          const statusMap = {};
          await Promise.all(
            data.elections.map(async (elec) => {
              try {
                const res = await voteService.checkStudentVoted(elec._id);
                statusMap[elec._id] = res;
              } catch (err) {
                statusMap[elec._id] = { hasVoted: false };
              }
            })
          );
          setVotedElectionsMap(statusMap);
        }
      } catch (err) {
        console.error('Error loading student dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading your student portal..." />;
  }

  const activeElections = elections.filter((e) => e.status === 'active');
  const pastElections = elections.filter((e) => e.status === 'ended');

  return (
    <div className="container py-4">
      {/* Student Welcome Banner */}
      <div className="card custom-card p-4 mb-4 border-0" style={{ background: 'linear-gradient(135deg, #1e3a8a, #1e40af)', color: '#fff' }}>
        <div className="row align-items-center">
          <div className="col-md-7">
            <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-bold text-uppercase fs-xs mb-2">
              Student Dashboard
            </span>
            <h2 className="fw-extrabold mb-1">Welcome back, {user?.name}!</h2>
            <p className="mb-0 text-light opacity-90">
              Department: {user?.department} • {user?.year} • Roll No: <strong>{user?.rollNumber}</strong>
            </p>
          </div>
          <div className="col-md-5 text-md-end mt-3 mt-md-0 d-flex flex-wrap justify-content-md-end gap-2">
            <Link to="/candidates" className="btn btn-warning rounded-pill px-3 py-2 fw-bold text-dark">
              Browse Candidates
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-outline-light rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5"
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Active Elections */}
        <div className="col-lg-8">
          <div className="card custom-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center gap-2">
                <Vote className="text-primary" size={24} />
                <h4 className="fw-bold mb-0">Active Campus Elections</h4>
              </div>
              <span className="badge bg-success rounded-pill px-3 py-2">
                {activeElections.length} Active
              </span>
            </div>

            {activeElections.length === 0 ? (
              <div className="text-center py-5 border rounded-3 bg-light">
                <Clock size={40} className="text-muted mb-2" />
                <h6 className="fw-semibold">No Active Elections Right Now</h6>
                <p className="text-muted fs-sm mb-0">Check back when new voting polls open.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {activeElections.map((elec) => {
                  const voteState = votedElectionsMap[elec._id];
                  const hasVoted = voteState?.hasVoted;

                  return (
                    <div key={elec._id} className="p-3 border rounded-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 bg-white shadow-sm">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="badge bg-primary text-uppercase fs-xs">{elec.position}</span>
                          <span className="text-muted fs-xs">Ends: {new Date(elec.endDate).toLocaleDateString()}</span>
                        </div>
                        <h5 className="fw-bold mb-1">{elec.title}</h5>
                        <p className="text-secondary fs-sm mb-0">{elec.description}</p>
                      </div>

                      <div className="flex-shrink-0">
                        {hasVoted ? (
                          <div className="text-end">
                            <span className="badge bg-success rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1">
                              <CheckCircle2 size={16} /> Vote Cast
                            </span>
                            <div className="fs-xs text-muted mt-1">
                              Voted for: <strong>{voteState.candidate?.name}</strong>
                            </div>
                          </div>
                        ) : (
                          <Link to={`/vote/${elec._id}`} className="btn btn-primary rounded-pill px-4 fw-bold">
                            Cast Vote Now
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Past Elections & Results Quick Access */}
        <div className="col-lg-4">
          <div className="card custom-card p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-4">
              <Award className="text-warning" size={24} />
              <h5 className="fw-bold mb-0">Concluded Results</h5>
            </div>

            {pastElections.length === 0 ? (
              <p className="text-muted fs-sm">No closed election records available yet.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {pastElections.map((elec) => (
                  <div key={elec._id} className="p-3 border rounded-3 bg-light">
                    <h6 className="fw-bold mb-1">{elec.title}</h6>
                    <p className="text-muted fs-xs mb-2">Position: {elec.position}</p>
                    <Link to={`/results/${elec._id}`} className="btn btn-sm btn-outline-secondary w-100 rounded-pill d-flex align-items-center justify-content-center gap-1">
                      View Winner & Charts <ArrowRight size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
