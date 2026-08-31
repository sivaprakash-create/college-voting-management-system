import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import electionService from '../services/electionService';
import LoadingSpinner from '../components/LoadingSpinner';
import ModalConfirm from '../components/ModalConfirm';
import { Vote, Plus, Edit, Trash2, Calendar, Award, Play, Square } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageElectionsPage = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form helper for date string conversions
  const formatIsoForInput = (isoStr) => {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    const pad = (num) => String(num).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    position: 'President',
    startDate: '',
    endDate: '',
    status: 'upcoming'
  });
  const [error, setError] = useState('');

  const fetchElections = async () => {
    try {
      const res = await electionService.getAllElections();
      if (res.success) {
        setElections(res.elections);
      }
    } catch (err) {
      console.error('Error fetching elections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setSelectedElection(null);
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    setFormData({
      title: '',
      description: '',
      position: 'President',
      startDate: formatIsoForInput(now),
      endDate: formatIsoForInput(nextWeek),
      status: 'upcoming'
    });
    setError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (elec) => {
    setIsEditMode(true);
    setSelectedElection(elec);
    setFormData({
      title: elec.title,
      description: elec.description,
      position: elec.position,
      startDate: formatIsoForInput(elec.startDate),
      endDate: formatIsoForInput(elec.endDate),
      status: elec.status
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      return setError('End Date must be strictly after Start Date.');
    }

    try {
      if (isEditMode) {
        const res = await electionService.updateElection(selectedElection._id, formData);
        if (res.success) {
          setShowModal(false);
          fetchElections();
        }
      } else {
        const res = await electionService.createElection(formData);
        if (res.success) {
          setShowModal(false);
          fetchElections();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const toggleElectionState = async (elec, targetStatus) => {
    try {
      const res = await electionService.updateElection(elec._id, { status: targetStatus });
      if (res.success) {
        fetchElections();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await electionService.deleteElection(deleteConfirmId);
      if (res.success) {
        setDeleteConfirmId(null);
        fetchElections();
      }
    } catch (err) {
      console.error('Failed to delete election:', err);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main-content">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h3 className="fw-bold mb-1">Manage Elections</h3>
            <p className="text-secondary mb-0">Create, configure timelines, and control active voting polls</p>
          </div>
          <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2" onClick={handleOpenAddModal}>
            <Plus size={18} /> Create New Election
          </button>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading elections configuration..." />
        ) : (
          <div className="row g-4">
            {elections.length === 0 ? (
              <div className="col-12 text-center py-5">
                <Vote size={48} className="text-muted mb-2" />
                <h5>No Elections Found</h5>
                <p className="text-muted">Click "Create New Election" to set up your first voting poll.</p>
              </div>
            ) : (
              elections.map((elec) => (
                <div className="col-md-6 col-lg-4" key={elec._id}>
                  <div className="card custom-card h-100 p-4 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <span className={`badge-status badge-${elec.status}`}>
                          {elec.status}
                        </span>
                        <span className="badge bg-light text-dark border fw-semibold">
                          {elec.position}
                        </span>
                      </div>
                      <h4 className="fw-bold mb-2">{elec.title}</h4>
                      <p className="text-secondary fs-sm mb-3">{elec.description}</p>
                    </div>

                    <div>
                      <div className="bg-light p-2 rounded-3 fs-xs text-muted mb-3">
                        <div className="d-flex align-items-center gap-1 mb-1">
                          <Calendar size={14} /> Start: {new Date(elec.startDate).toLocaleString()}
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <Calendar size={14} /> End: {new Date(elec.endDate).toLocaleString()}
                        </div>
                      </div>

                      {/* Control buttons */}
                      <div className="d-flex gap-2 mb-2">
                        {elec.status !== 'active' && elec.status !== 'ended' && (
                          <button
                            className="btn btn-sm btn-success flex-grow-1 rounded-pill d-flex align-items-center justify-content-center gap-1"
                            onClick={() => toggleElectionState(elec, 'active')}
                          >
                            <Play size={14} /> Start Poll
                          </button>
                        )}
                        {elec.status === 'active' && (
                          <button
                            className="btn btn-sm btn-warning flex-grow-1 rounded-pill d-flex align-items-center justify-content-center gap-1"
                            onClick={() => toggleElectionState(elec, 'ended')}
                          >
                            <Square size={14} /> End Poll
                          </button>
                        )}
                        <Link
                          to={`/results/${elec._id}`}
                          className="btn btn-sm btn-outline-secondary flex-grow-1 rounded-pill text-center"
                        >
                          Results
                        </Link>
                      </div>

                      <div className="d-flex justify-content-end gap-2 border-top pt-3">
                        <button
                          className="btn btn-sm btn-outline-primary rounded-circle"
                          onClick={() => handleOpenEditModal(elec)}
                          title="Edit Election"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger rounded-circle"
                          onClick={() => setDeleteConfirmId(elec._id)}
                          title="Delete Election"
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
                    {isEditMode ? 'Edit Election Settings' : 'Create New Election'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {error && <div className="alert alert-danger fs-sm mb-3">{error}</div>}

                    <div className="mb-3">
                      <label className="form-label fw-semibold fs-sm">Election Title</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Student Body President Election 2026"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold fs-sm">Contesting Position Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. President, Vice President, Sports Secretary"
                        required
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      />
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label fw-semibold fs-sm">Start Date & Time</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          required
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold fs-sm">End Date & Time</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          required
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold fs-sm">Initial Status Override</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="active">Active (Voting Live)</option>
                        <option value="ended">Ended (Concluded)</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold fs-sm">Description & Rules</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        required
                        placeholder="Provide details about election eligibility and scope..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-light rounded-pill" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary rounded-pill px-4">
                      {isEditMode ? 'Save Changes' : 'Publish Election'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        <ModalConfirm
          isOpen={!!deleteConfirmId}
          title="Delete Election"
          message="Are you sure you want to delete this election? ALL associated candidates and cast votes will be permanently deleted."
          confirmText="Delete Election"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirmId(null)}
        />
      </div>
    </div>
  );
};

export default ManageElectionsPage;
