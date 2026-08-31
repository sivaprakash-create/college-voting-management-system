import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Vote, ShieldCheck, Award, Users, CheckCircle, ArrowRight, BarChart3 } from 'lucide-react';
import electionService from '../services/electionService';

const LandingPage = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const data = await electionService.getAllElections();
        if (data.success) {
          setElections(data.elections);
        }
      } catch (err) {
        console.error('Error fetching public elections:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  return (
    <div className="container py-4">
      {/* Hero Banner */}
      <div className="hero-banner text-center position-relative overflow-hidden">
        <div className="position-relative z-1 py-4">
          <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-bold text-uppercase mb-3 fs-xs">
            Official Campus Electoral Portal
          </span>
          <h1 className="display-4 fw-extrabold mb-3">
            Secure, Transparent & Digital Voting System
          </h1>
          <p className="lead mx-auto mb-4 text-light opacity-90" style={{ maxWidth: '680px' }}>
            Empowering students to exercise their democratic right with tamper-proof MongoDB encryption and real-time result analytics.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/login" className="btn btn-warning btn-lg px-4 fw-bold rounded-pill text-dark d-flex align-items-center gap-2">
              Cast Your Vote <ArrowRight size={20} />
            </Link>
            <Link to="/register" className="btn btn-outline-light btn-lg px-4 rounded-pill">
              Student Registration
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="feature-box text-center">
            <div className="stat-icon primary mx-auto mb-3">
              <ShieldCheck size={32} />
            </div>
            <h5 className="fw-bold mb-2">100% Tamper-Proof Security</h5>
            <p className="text-secondary mb-0">
              JWT authentication, encrypted password storage, and database compound indexes prevent duplicate voting.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="feature-box text-center">
            <div className="stat-icon success mx-auto mb-3">
              <BarChart3 size={32} />
            </div>
            <h5 className="fw-bold mb-2">Instant Real-Time Results</h5>
            <p className="text-secondary mb-0">
              Automated vote tallying with percentage distributions and dynamic winner declarations as soon as elections close.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="feature-box text-center">
            <div className="stat-icon info mx-auto mb-3">
              <Award size={32} />
            </div>
            <h5 className="fw-bold mb-2">Verified Student Representation</h5>
            <p className="text-secondary mb-0">
              Only registered campus students with valid roll numbers can participate in candidate elections.
            </p>
          </div>
        </div>
      </div>

      {/* Active & Upcoming Elections Section */}
      <div className="mb-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="fw-bold mb-1">Campus Elections</h3>
            <p className="text-secondary mb-0">Browse current, upcoming, and past elections.</p>
          </div>
          <Link to="/candidates" className="btn btn-outline-primary rounded-pill px-3">
            View All Candidates
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : elections.length === 0 ? (
          <div className="card custom-card text-center py-5">
            <Vote size={48} className="text-muted mx-auto mb-2" />
            <h5 className="fw-semibold">No Elections Scheduled</h5>
            <p className="text-muted">Check back later for active campus elections.</p>
          </div>
        ) : (
          <div className="row g-4">
            {elections.map((election) => (
              <div className="col-md-6 col-lg-4" key={election._id}>
                <div className="card custom-card h-100 p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span className={`badge-status badge-${election.status}`}>
                        {election.status}
                      </span>
                      <span className="badge bg-light text-dark border">
                        {election.position}
                      </span>
                    </div>
                    <h5 className="fw-bold mb-2">{election.title}</h5>
                    <p className="text-secondary fs-sm mb-3">
                      {election.description}
                    </p>
                  </div>
                  <div>
                    <div className="border-top pt-3 mt-2 fs-xs text-muted d-flex justify-content-between">
                      <span>Start: {new Date(election.startDate).toLocaleDateString()}</span>
                      <span>End: {new Date(election.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-3">
                      {election.status === 'active' ? (
                        <Link to={`/vote/${election._id}`} className="btn btn-primary w-100 rounded-pill">
                          Vote Now
                        </Link>
                      ) : election.status === 'ended' ? (
                        <Link to={`/results/${election._id}`} className="btn btn-outline-secondary w-100 rounded-pill">
                          View Final Results
                        </Link>
                      ) : (
                        <button className="btn btn-light w-100 rounded-pill" disabled>
                          Upcoming Election
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
