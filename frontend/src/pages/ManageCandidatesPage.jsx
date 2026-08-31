import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import candidateService from '../services/candidateService';
import electionService from '../services/electionService';
import LoadingSpinner from '../components/LoadingSpinner';
import ModalConfirm from '../components/ModalConfirm';
import { UserCheck, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';

const ManageCandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedElectionFilter, setSelectedElectionFilter] = useState('all');

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    department: 'Computer Science',
    year: '3rd Year',
    position: 'President',
    manifesto: '',
    image: '',
    electionId: ''
  });
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [candRes, elecRes] = await Promise.all([
        candidateService.getAllCandidates(),
        electionService.getAllElections()
      ]);

      if (candRes.success) setCandidates(candRes.candidates);
      if (elecRes.success) setElections(elecRes.elections);
    } catch (err) {
      console.error('Error loading candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setSelectedCandidate(null);
    setFormData({
      name: '',
      department: 'Computer Science',
      year: '3rd Year',
      position: elections[0]?.position || 'President',
      manifesto: '',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      electionId: elections[0]?._id || ''
    });
    setError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (cand) => {
    setIsEditMode(true);
    setSelectedCandidate(cand);
    setFormData({
      name: cand.name,
      department: cand.department,
      year: cand.year,
      position: cand.position,
      manifesto: cand.manifesto,
      image: cand.image,
      electionId: cand.electionId?._id || cand.electionId
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.electionId) {
      return setError('Please select an election for this candidate.');
    }

    try {
      if (isEditMode) {
        const res = await candidateService.updateCandidate(selectedCandidate._id, formData);
        if (res.success) {
          setShowModal(false);
          fetchData();
        }
      } else {
        const res = await candidateService.createCandidate(formData);
        if (res.success) {
          setShowModal(false);
          fetchData();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await candidateService.deleteCandidate(deleteConfirmId);
      if (res.success) {
        setDeleteConfirmId(null);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to delete candidate:', err);
    }
  };

  const filteredCandidates = candidates.filter((cand) => {
    const matchesElection =
      selectedElectionFilter === 'all' ||
      cand.electionId?._id === selectedElectionFilter ||
      cand.electionId === selectedElectionFilter;

    const matchesSearch =
      cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.position.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesElection && matchesSearch;
  });

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main-content">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h3 className="fw-bold mb-1">Manage Candidates</h3>
            <p className="text-secondary mb-0">Register and update candidate profiles and manifestos</p>
          </div>
          <button
            className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2"
            onClick={handleOpenAddModal}
            disabled={elections.length === 0}
          >
            <Plus size={18} /> Add New Candidate
          </button>
        </div>

        {/* Filters */}
        <div className="card custom-card p-3 mb-4">
          <div className="row g-2">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={18} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control bg-white border-start-0"
                  placeholder="Search by candidate name, position, department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={selectedElectionFilter}
                onChange={(e) => setSelectedElectionFilter(e.target.value)}
              >
                <option value="all">Filter by Election (All)</option>
                {elections.map((elec) => (
                  <option key={elec._id} value={elec._id}>
                    {elec.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading candidate records..." />
        ) : (
          <div className="row g-4">
            {filteredCandidates.length === 0 ? (
              <div className="col-12 text-center py-5">
                <UserCheck size={48} className="text-muted mb-2" />
                <h5>No Candidates Found</h5>
                <p className="text-muted">Create a candidate or adjust your filter.</p>
              </div>
            ) : (
              filteredCandidates.map((cand) => (
                <div className="col-md-6 col-lg-4" key={cand._id}>
                  <div className="card custom-card h-100 p-3">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <img
                        src={cand.image}
                        alt={cand.name}
                        className="rounded-circle object-fit-cover"
                        style={{ width: '60px', height: '60px' }}
                      />
                      <div>
                        <span className="badge bg-primary text-uppercase fs-xs">{cand.position}</span>
                        <h5 className="fw-bold mb-0 mt-1">{cand.name}</h5>
                        <p className="text-muted fs-xs mb-0">{cand.department} • {cand.year}</p>
                      </div>
                    </div>

                    <p className="fs-xs text-secondary bg-light p-2 rounded-2 mb-3">
                      "{cand.manifesto}"
                    </p>

                    <div className="mt-auto d-flex justify-content-between align-items-center border-top pt-2">
                      <span className="fs-xs text-muted truncate" style={{ maxWidth: '180px' }}>
                        {cand.electionId?.title || 'Election'}
                      </span>
                      <div>
                        <button
                          className="btn btn-sm btn-outline-primary me-2 rounded-circle"
                          onClick={() => handleOpenEditModal(cand)}
                          title="Edit Candidate"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger rounded-circle"
                          onClick={() => setDeleteConfirmId(cand._id)}
                          title="Delete Candidate"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    {isEditMode ? 'Edit Candidate Details' : 'Add Candidate to Election'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {error && <div className="alert alert-danger fs-sm mb-3">{error}</div>}

                    <div className="mb-3">
                      <label className="form-label fw-semibold fs-sm">Select Election</label>
                      <select
                        className="form-select"
                        required
                        value={formData.electionId}
                        onChange={(e) => {
                          const elec = elections.find((x) => x._id === e.target.value);
                          setFormData({
                            ...formData,
                            electionId: e.target.value,
                            position: elec?.position || formData.position
                          });
                        }}
                      >
                        {elections.map((elec) => (
                          <option key={elec._id} value={elec._id}>
                            {elec.title} ({elec.position})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold fs-sm">Candidate Name</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label fw-semibold fs-sm">Department</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold fs-sm">Academic Year</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold fs-sm">Contesting Position Title</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold fs-sm">Photo URL (Optional)</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://..."
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold fs-sm">Manifesto Agenda</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        required
                        placeholder="Describe key candidate goals and promises..."
                        value={formData.manifesto}
                        onChange={(e) => setFormData({ ...formData, manifesto: e.target.value })}
                      ></textarea>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-light rounded-pill" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary rounded-pill px-4">
                      {isEditMode ? 'Save Candidate' : 'Create Candidate'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm */}
        <ModalConfirm
          isOpen={!!deleteConfirmId}
          title="Delete Candidate"
          message="Are you sure you want to delete this candidate? Votes cast for this candidate will also be deleted."
          confirmText="Delete Candidate"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirmId(null)}
        />
      </div>
    </div>
  );
};

export default ManageCandidatesPage;
