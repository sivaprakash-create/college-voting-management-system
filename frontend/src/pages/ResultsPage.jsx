import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import voteService from '../services/voteService';
import LoadingSpinner from '../components/LoadingSpinner';
import { Award, Users, Vote as VoteIcon, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ResultsPage = () => {
  const { electionId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await voteService.getElectionResults(electionId);
        if (res.success) {
          setData(res);
        } else {
          setError(res.message || 'Failed to fetch results');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading election results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [electionId]);

  if (loading) {
    return <LoadingSpinner message="Calculating election turnout & vote tallies..." />;
  }

  if (error || !data) {
    return (
      <div className="container py-5 text-center">
        <div className="card custom-card p-5 max-w-lg mx-auto" style={{ maxWidth: '500px' }}>
          <h4 className="fw-bold text-danger mb-2">Error Loading Results</h4>
          <p className="text-muted">{error}</p>
          <Link to="/" className="btn btn-primary rounded-pill px-4">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const { election, totalStudents, totalVotesInElection, turnoutPercentage, winner, candidateResults } = data;

  return (
    <div className="container py-4">
      {/* Header & Back link */}
      <div className="mb-4">
        <Link to="/" className="text-decoration-none text-muted d-inline-flex align-items-center gap-1 mb-2 fs-sm">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <span className={`badge-status badge-${election.status} mb-2 d-inline-block`}>
              {election.status === 'ended' ? 'Election Concluded' : election.status}
            </span>
            <h2 className="fw-extrabold mb-1">{election.title}</h2>
            <p className="text-secondary mb-0">Official Certified Electoral Tally & Metrics</p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon primary">
              <Users size={28} />
            </div>
            <div>
              <h6 className="text-secondary fw-semibold mb-1 fs-xs text-uppercase">Eligible Voters</h6>
              <h3 className="fw-bold mb-0">{totalStudents}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon success">
              <VoteIcon size={28} />
            </div>
            <div>
              <h6 className="text-secondary fw-semibold mb-1 fs-xs text-uppercase">Total Votes Cast</h6>
              <h3 className="fw-bold mb-0">{totalVotesInElection}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon warning">
              <Award size={28} />
            </div>
            <div>
              <h6 className="text-secondary fw-semibold mb-1 fs-xs text-uppercase">Voter Turnout</h6>
              <h3 className="fw-bold mb-0">{turnoutPercentage}%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Winner Spotlight Card */}
      {winner && !winner.isTie ? (
        <div className="card custom-card p-4 mb-5 border-0 shadow-lg winner-badge-glow" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff' }}>
          <div className="row align-items-center">
            <div className="col-auto text-center mb-3 mb-md-0">
              <img
                src={winner.image}
                alt={winner.name}
                className="rounded-circle border border-4 border-white object-fit-cover"
                style={{ width: '100px', height: '100px' }}
              />
            </div>
            <div className="col">
              <span className="badge bg-white text-dark rounded-pill px-3 py-1 fw-bold fs-xs text-uppercase mb-2">
                🏆 Elected Winner
              </span>
              <h2 className="fw-extrabold mb-1">{winner.name}</h2>
              <p className="mb-0 text-white-50 fs-sm">
                Position: <strong>{winner.position}</strong> • Department: {winner.department}
              </p>
            </div>
            <div className="col-md-3 text-md-end mt-3 mt-md-0">
              <div className="display-5 fw-extrabold">{winner.votes}</div>
              <div className="fs-xs text-uppercase fw-semibold">Votes ({winner.percentage}%)</div>
            </div>
          </div>
        </div>
      ) : winner && winner.isTie ? (
        <div className="card custom-card p-4 mb-5 bg-warning text-dark border-0">
          <h4 className="fw-bold mb-1">🤝 Outcome: Tie Between Top Candidates</h4>
          <p className="mb-0 fs-sm">Multiple candidates received an equal number of highest votes ({winner.votes} votes).</p>
        </div>
      ) : null}

      {/* Full Candidate Vote Breakdown */}
      <div className="card custom-card p-4">
        <h4 className="fw-bold mb-4">Detailed Vote Breakdown</h4>

        {candidateResults.length === 0 ? (
          <p className="text-muted">No candidate results available.</p>
        ) : (
          <div className="d-flex flex-column gap-4">
            {candidateResults.map((cand, index) => {
              const isWinner = winner && !winner.isTie && winner.id === cand.id;
              return (
                <div key={cand.id} className="p-3 border rounded-3 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-3">
                      <span className="fw-extrabold text-muted fs-5" style={{ width: '24px' }}>
                        #{index + 1}
                      </span>
                      <img
                        src={cand.image}
                        alt={cand.name}
                        className="rounded-circle object-fit-cover"
                        style={{ width: '48px', height: '48px' }}
                      />
                      <div>
                        <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                          {cand.name}
                          {isWinner && <CheckCircle2 size={18} className="text-warning" />}
                        </h5>
                        <span className="text-muted fs-xs">{cand.department}</span>
                      </div>
                    </div>

                    <div className="text-end">
                      <h5 className="fw-bold mb-0">{cand.votes} Votes</h5>
                      <span className="fs-xs fw-semibold text-primary">{cand.percentage}%</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="vote-progress mt-2">
                    <div
                      className={`vote-progress-fill ${isWinner ? 'bg-warning' : 'bg-primary'}`}
                      style={{ width: `${cand.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
