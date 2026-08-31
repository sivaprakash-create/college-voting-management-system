import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import voteService from '../services/voteService';
import electionService from '../services/electionService';
import { Users, UserCheck, Vote, Award, Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCandidates: 0,
    totalElections: 0,
    activeElections: 0,
    totalVotes: 0,
    votingPercentage: 0
  });

  const [recentVotes, setRecentVotes] = useState([]);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        const [statsRes, elecRes] = await Promise.all([
          voteService.getDashboardStats(),
          electionService.getAllElections()
        ]);

        if (statsRes.success) {
          setStats(statsRes.stats);
          setRecentVotes(statsRes.recentVotes || []);
        }

        if (elecRes.success) {
          setElections(elecRes.elections);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboard();
  }, []);

  if (loading) {
    return (
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-main-content">
          <LoadingSpinner message="Loading Admin Statistics..." />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">Election Control Center</h3>
            <p className="text-secondary mb-0">System performance, voter turnout, and electoral statistics</p>
          </div>
          <Link to="/admin/elections" className="btn btn-primary rounded-pill px-4">
            + Create New Election
          </Link>
        </div>

        {/* Stat Cards Grid */}
        <div className="row g-4 mb-5">
          <div className="col-md-6 col-lg-3">
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              icon={Users}
              color="primary"
              subtitle="Registered campus voters"
            />
          </div>

          <div className="col-md-6 col-lg-3">
            <StatCard
              title="Total Candidates"
              value={stats.totalCandidates}
              icon={UserCheck}
              color="info"
              subtitle="Across all positions"
            />
          </div>

          <div className="col-md-6 col-lg-3">
            <StatCard
              title="Active Elections"
              value={stats.activeElections}
              icon={Vote}
              color="warning"
              subtitle={`Out of ${stats.totalElections} total`}
            />
          </div>

          <div className="col-md-6 col-lg-3">
            <StatCard
              title="Total Votes Cast"
              value={stats.totalVotes}
              icon={Award}
              color="success"
              subtitle={`${stats.votingPercentage}% Turnout`}
            />
          </div>
        </div>

        {/* Elections & Live Log Section */}
        <div className="row g-4">
          {/* Active Elections Table */}
          <div className="col-lg-7">
            <div className="card custom-card p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Managed Elections</h5>
                <Link to="/admin/elections" className="fs-xs fw-bold text-primary text-decoration-none">
                  View All &rarr;
                </Link>
              </div>

              {elections.length === 0 ? (
                <p className="text-muted">No elections created yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr className="fs-xs text-muted text-uppercase">
                        <th>Title</th>
                        <th>Position</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {elections.slice(0, 5).map((elec) => (
                        <tr key={elec._id}>
                          <td className="fw-semibold">{elec.title}</td>
                          <td>{elec.position}</td>
                          <td>
                            <span className={`badge-status badge-${elec.status}`}>
                              {elec.status}
                            </span>
                          </td>
                          <td>
                            <Link to={`/results/${elec._id}`} className="btn btn-sm btn-outline-secondary rounded-pill">
                              Results
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Recent Audit Log */}
          <div className="col-lg-5">
            <div className="card custom-card p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Activity size={20} className="text-primary" />
                <h5 className="fw-bold mb-0">Recent Votes Audit Log</h5>
              </div>

              {recentVotes.length === 0 ? (
                <p className="text-muted fs-sm">No recent voting logs registered.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {recentVotes.map((v) => (
                    <div key={v._id} className="p-3 border rounded-3 bg-light fs-xs">
                      <div className="d-flex justify-content-between fw-bold text-dark mb-1">
                        <span>{v.studentId?.name || 'Anonymous Student'}</span>
                        <span className="text-muted">{new Date(v.votedAt).toLocaleTimeString()}</span>
                      </div>
                      <div className="text-secondary">
                        Voted for: <strong>{v.candidateId?.name || 'Candidate'}</strong> ({v.electionId?.title || 'Election'})
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
