import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import electionService from '../services/electionService';
import voteService from '../services/voteService';
import LoadingSpinner from '../components/LoadingSpinner';
import ModalConfirm from '../components/ModalConfirm';
import { Vote, AlertTriangle, CheckCircle, ShieldAlert, BookOpen } from 'lucide-react';

const VotingPage = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [alreadyVotedInfo, setAlreadyVotedInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchElectionAndCheckStatus = async () => {
      try {
        const [elecData, checkData] = await Promise.all([
          electionService.getElectionById(electionId),
          voteService.checkStudentVoted(electionId)
        ]);

        if (elecData.success) {
          setElection(elecData.election);
          setCandidates(elecData.candidates);
        }

        if (checkData.hasVoted) {
          setHasVoted(true);
          setAlreadyVotedInfo(checkData);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading election details');
      } finally {
        setLoading(false);
      }
    };

    fetchElectionAndCheckStatus();
  }, [electionId]);

  const handleVoteSubmit = async () => {
    if (!selectedCandidate) return;
    setShowConfirmModal(false);
    setSubmitting(true);
    setError('');

    try {
      const res = await voteService.castVote({
        electionId,
        candidateId: selectedCandidate._id
      });

      if (res.success) {
        navigate('/vote-confirmation', {
          state: {
            electionTitle: election.title,
            candidateName: selectedCandidate.name,
            candidatePosition: selectedCandidate.position,
            votedAt: res.vote.votedAt
          }
        });
      } else {
        setError(res.message || 'Voting failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit vote');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Securing voting session..." />;
  }

  if (hasVoted) {
    return (
      <div className="container py-5">
        <div className="card custom-card max-w-lg mx-auto p-5 text-center" style={{ maxWidth: '600px' }}>
          <div className="stat-icon success mx-auto mb-3">
            <CheckCircle size={40} />
          </div>
          <h3 className="fw-bold mb-2">Vote Already Registered</h3>
          <p className="text-secondary mb-4">
            You have already cast your vote in <strong>{election?.title}</strong>. Multiple votes are strictly prohibited.
          </p>
          <div className="bg-light p-3 rounded-3 text-start mb-4">
            <p className="mb-1 fs-sm">Candidate Chosen: <strong>{alreadyVotedInfo?.candidate?.name}</strong></p>
            <p className="mb-0 fs-sm text-muted">Voted On: {new Date(alreadyVotedInfo?.votedAt).toLocaleString()}</p>
          </div>
          <button className="btn btn-primary rounded-pill px-4" onClick={() => navigate('/student/dashboard')}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!election || election.status !== 'active') {
    return (
      <div className="container py-5">
        <div className="card custom-card max-w-lg mx-auto p-5 text-center" style={{ maxWidth: '600px' }}>
          <ShieldAlert size={48} className="text-danger mx-auto mb-3" />
          <h4 className="fw-bold mb-2">Voting Is Closed</h4>
          <p className="text-secondary mb-4">
            This election is either upcoming or has already concluded. Voting is only allowed during active poll hours.
          </p>
          <button className="btn btn-outline-primary rounded-pill px-4" onClick={() => navigate('/student/dashboard')}>
            Back to Student Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Election Header */}
      <div className="card custom-card p-4 mb-4 border-start border-4 border-primary">
        <span className="badge bg-success rounded-pill px-3 py-1 text-uppercase fs-xs w-auto me-auto mb-2">
          Active Poll
        </span>
        <h2 className="fw-extrabold mb-1">{election.title}</h2>
        <p className="text-secondary mb-2">{election.description}</p>
        <div className="d-flex align-items-center gap-3 fs-xs text-muted">
          <span>Position: <strong>{election.position}</strong></span>
          <span>•</span>
          <span>Poll Closes: <strong>{new Date(election.endDate).toLocaleString()}</strong></span>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
          <AlertTriangle size={20} />
          <div>{error}</div>
        </div>
      )}

      {/* Candidate Ballot Options */}
      <h4 className="fw-bold mb-3">Cast Your Ballot for Position: {election.position}</h4>
      <p className="text-secondary mb-4">
        Select <strong>one</strong> candidate below. Once submitted, your vote is encrypted and cannot be changed.
      </p>

      <div className="row g-4 mb-4">
        {candidates.map((cand) => {
          const isSelected = selectedCandidate?._id === cand._id;
          return (
            <div className="col-md-6 col-lg-4" key={cand._id}>
              <div
                className={`card custom-card h-100 p-3 cursor-pointer border-2 transition-all ${
                  isSelected ? 'border-primary bg-light shadow-lg' : 'border-light'
                }`}
                onClick={() => setSelectedCandidate(cand)}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex gap-3 align-items-center mb-3">
                  <img
                    src={cand.image}
                    alt={cand.name}
                    className="rounded-circle object-fit-cover"
                    style={{ width: '64px', height: '64px' }}
                  />
                  <div>
                    <h5 className="fw-bold mb-0">{cand.name}</h5>
                    <p className="text-muted fs-xs mb-0">{cand.department} • {cand.year}</p>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-3 border mb-3 flex-grow-1">
                  <span className="fs-xs fw-bold text-uppercase text-secondary d-flex align-items-center gap-1 mb-1">
                    <BookOpen size={14} /> Manifesto Summary
                  </span>
                  <p className="fs-sm text-dark mb-0">"{cand.manifesto}"</p>
                </div>

                <button
                  className={`btn w-100 rounded-pill fw-bold ${
                    isSelected ? 'btn-primary' : 'btn-outline-secondary'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCandidate(cand);
                  }}
                >
                  {isSelected ? '✓ Selected Candidate' : 'Select Candidate'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button Bar */}
      <div className="card custom-card p-4 d-flex flex-row justify-content-between align-items-center sticky-bottom bg-white border-top shadow">
        <div>
          {selectedCandidate ? (
            <p className="mb-0 fw-semibold text-primary">
              You selected: <strong>{selectedCandidate.name}</strong>
            </p>
          ) : (
            <p className="mb-0 text-muted">Please select a candidate to enable vote submission.</p>
          )}
        </div>
        <button
          className="btn btn-success btn-lg rounded-pill px-5 fw-bold"
          disabled={!selectedCandidate || submitting}
          onClick={() => setShowConfirmModal(true)}
        >
          {submitting ? 'Submitting...' : 'Confirm & Submit Vote'}
        </button>
      </div>

      {/* Confirmation Modal */}
      <ModalConfirm
        isOpen={showConfirmModal}
        title="Confirm Your Vote"
        message={`Are you sure you want to cast your vote for ${selectedCandidate?.name} in the "${election.title}"? This decision is final and cannot be modified.`}
        confirmText="Yes, Submit Vote"
        confirmVariant="success"
        onConfirm={handleVoteSubmit}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};

export default VotingPage;
