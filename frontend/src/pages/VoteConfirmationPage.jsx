import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, ArrowRight, Home } from 'lucide-react';

const VoteConfirmationPage = () => {
  const location = useLocation();
  const voteDetails = location.state;

  if (!voteDetails) {
    return <Navigate to="/student/dashboard" replace />;
  }

  return (
    <div className="container py-5">
      <div className="card custom-card max-w-lg mx-auto p-5 text-center shadow-lg" style={{ maxWidth: '640px' }}>
        <div className="stat-icon success mx-auto mb-4" style={{ width: '72px', height: '72px' }}>
          <CheckCircle2 size={48} />
        </div>

        <h2 className="fw-extrabold text-success mb-2">Vote Successfully Recorded!</h2>
        <p className="text-secondary lead mb-4">
          Thank you for participating in your campus democratic process. Your vote has been securely saved in MongoDB.
        </p>

        {/* Receipt Box */}
        <div className="bg-light p-4 rounded-4 text-start mb-4 border">
          <h6 className="fw-bold text-uppercase fs-xs text-secondary mb-3 border-bottom pb-2">
            Digital Vote Receipt
          </h6>
          
          <div className="row g-2 fs-sm">
            <div className="col-5 text-muted">Election Title:</div>
            <div className="col-7 fw-semibold">{voteDetails.electionTitle}</div>

            <div className="col-5 text-muted">Position:</div>
            <div className="col-7 fw-semibold">{voteDetails.candidatePosition}</div>

            <div className="col-5 text-muted">Candidate Chosen:</div>
            <div className="col-7 fw-semibold text-primary">{voteDetails.candidateName}</div>

            <div className="col-5 text-muted">Timestamp:</div>
            <div className="col-7 fw-semibold">
              {new Date(voteDetails.votedAt || Date.now()).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-center gap-2 text-success fs-xs mb-4">
          <ShieldCheck size={18} />
          <span>Verified & Double-Vote Guard Enabled</span>
        </div>

        <div className="d-flex gap-3 justify-content-center">
          <Link to="/student/dashboard" className="btn btn-primary rounded-pill px-4 fw-bold d-flex align-items-center gap-2">
            <Home size={18} /> Student Dashboard
          </Link>
          <Link to="/candidates" className="btn btn-outline-secondary rounded-pill px-4">
            View Candidate List
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VoteConfirmationPage;
