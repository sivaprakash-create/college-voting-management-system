import React, { useEffect, useState } from 'react';
import candidateService from '../services/candidateService';
import electionService from '../services/electionService';
import LoadingSpinner from '../components/LoadingSpinner';
import { UserCheck, Search, Filter, BookOpen } from 'lucide-react';

const CandidateListPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candRes, elecRes] = await Promise.all([
          candidateService.getAllCandidates(),
          electionService.getAllElections()
        ]);

        if (candRes.success) setCandidates(candRes.candidates);
        if (elecRes.success) setElections(elecRes.elections);
      } catch (err) {
        console.error('Error fetching candidates list:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Fetching candidate profiles..." />;
  }

  const filteredCandidates = candidates.filter((cand) => {
    const matchesElection =
      selectedElection === 'all' ||
      cand.electionId?._id === selectedElection ||
      cand.electionId === selectedElection;

    const matchesSearch =
      cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.position.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesElection && matchesSearch;
  });

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h3 className="fw-bold mb-1">Campus Candidates</h3>
          <p className="text-secondary mb-0">Learn about student representatives running for positions</p>
        </div>

        {/* Filter Controls */}
        <div className="d-flex flex-wrap gap-2">
          <div className="input-group" style={{ maxWidth: '260px' }}>
            <span className="input-group-text bg-white border-end-0">
              <Search size={18} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control bg-white border-start-0"
              placeholder="Search candidate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="d-flex align-items-center gap-2">
            <Filter size={18} className="text-muted" />
            <select
              className="form-select bg-white"
              value={selectedElection}
              onChange={(e) => setSelectedElection(e.target.value)}
            >
              <option value="all">All Elections</option>
              {elections.map((elec) => (
                <option key={elec._id} value={elec._id}>
                  {elec.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredCandidates.length === 0 ? (
        <div className="card custom-card text-center py-5">
          <UserCheck size={48} className="text-muted mx-auto mb-2" />
          <h5 className="fw-semibold">No Candidates Found</h5>
          <p className="text-muted mb-0">Try adjusting your election or search filter.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredCandidates.map((cand) => (
            <div className="col-md-6 col-lg-4" key={cand._id}>
              <div className="card custom-card h-100 overflow-hidden">
                <img
                  src={cand.image}
                  alt={cand.name}
                  className="candidate-card-img"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-primary rounded-pill px-3 py-1">
                        {cand.position}
                      </span>
                      <span className="fs-xs text-muted fw-semibold">
                        {cand.year}
                      </span>
                    </div>
                    <h4 className="fw-bold mb-1">{cand.name}</h4>
                    <p className="text-muted fs-sm mb-3">{cand.department}</p>
                    
                    <div className="bg-light p-3 rounded-3 mb-3">
                      <h6 className="fw-bold fs-xs text-uppercase text-secondary mb-1 d-flex align-items-center gap-1">
                        <BookOpen size={14} /> Manifesto & Agenda
                      </h6>
                      <p className="fs-sm text-dark mb-0 italic">"{cand.manifesto}"</p>
                    </div>
                  </div>

                  <div className="border-top pt-3 fs-xs text-muted">
                    Election: <strong>{cand.electionId?.title || 'General Election'}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateListPage;
