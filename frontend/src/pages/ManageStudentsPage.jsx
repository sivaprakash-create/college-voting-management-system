import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import studentService from '../services/studentService';
import LoadingSpinner from '../components/LoadingSpinner';
import ModalConfirm from '../components/ModalConfirm';
import { Users, Plus, Edit, Trash2, Search, Mail, User, Hash } from 'lucide-react';

const ManageStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Computer Science',
    year: '1st Year',
    rollNumber: ''
  });
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    try {
      const res = await studentService.getAllStudents();
      if (res.success) {
        setStudents(res.students);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setSelectedStudent(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      department: 'Computer Science',
      year: '1st Year',
      rollNumber: ''
    });
    setError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (student) => {
    setIsEditMode(true);
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      password: '',
      department: student.department,
      year: student.year,
      rollNumber: student.rollNumber
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isEditMode) {
        const res = await studentService.updateStudent(selectedStudent._id, formData);
        if (res.success) {
          setShowModal(false);
          fetchStudents();
        }
      } else {
        const res = await studentService.createStudent(formData);
        if (res.success) {
          setShowModal(false);
          fetchStudents();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await studentService.deleteStudent(deleteConfirmId);
      if (res.success) {
        setDeleteConfirmId(null);
        fetchStudents();
      }
    } catch (err) {
      console.error('Failed to delete student:', err);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main-content">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h3 className="fw-bold mb-1">Manage Students</h3>
            <p className="text-secondary mb-0">Add, edit, view, or remove registered voters</p>
          </div>
          <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2" onClick={handleOpenAddModal}>
            <Plus size={18} /> Add New Student
          </button>
        </div>

        {/* Search Input */}
        <div className="card custom-card p-3 mb-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <Search size={18} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control bg-white border-start-0"
              placeholder="Search by student name, roll number, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading student records..." />
        ) : (
          <div className="card custom-card table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Roll Number</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Academic Year</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No matching student records found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((st) => (
                    <tr key={st._id}>
                      <td className="fw-bold">{st.rollNumber}</td>
                      <td>{st.name}</td>
                      <td>{st.email}</td>
                      <td>{st.department}</td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {st.year}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2 rounded-circle"
                          onClick={() => handleOpenEditModal(st)}
                          title="Edit Student"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger rounded-circle"
                          onClick={() => setDeleteConfirmId(st._id)}
                          title="Delete Student"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    {isEditMode ? 'Edit Student Details' : 'Register New Student'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {error && <div className="alert alert-danger fs-sm mb-3">{error}</div>}

                    <div className="mb-3">
                      <label className="form-label fw-semibold fs-sm">Full Name</label>
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
                        <label className="form-label fw-semibold fs-sm">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold fs-sm">Roll Number</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          value={formData.rollNumber}
                          onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                        />
                      </div>
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
                        <select
                          className="form-select"
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        >
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold fs-sm">
                        Password {isEditMode ? '(Leave blank to keep unchanged)' : ''}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder={isEditMode ? '••••••••' : 'Enter password'}
                        required={!isEditMode}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-light rounded-pill" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary rounded-pill px-4">
                      {isEditMode ? 'Save Changes' : 'Create Student'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ModalConfirm
          isOpen={!!deleteConfirmId}
          title="Delete Student Record"
          message="Are you sure you want to delete this student? All associated votes and history will be deleted."
          confirmText="Delete Student"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirmId(null)}
        />
      </div>
    </div>
  );
};

export default ManageStudentsPage;
