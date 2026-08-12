import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState({});
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    try {
      const res = await api.get('/workshops');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // We don't have a "list all trainers" endpoint yet — build a quick one, see Step 50 below
  const fetchTrainers = async () => {
    try {
      const res = await api.get('/users/trainers');
      setTrainers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchTrainers();
  }, []);

  const handleAssign = async (requestId) => {
    setError('');
    const trainerId = selectedTrainer[requestId];
    if (!trainerId) {
      setError('Please select a trainer first');
      return;
    }
    try {
      await api.put(`/workshops/${requestId}/assign`, { trainerId });
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const statusColor = { pending: '#f59e0b', assigned: '#3b82f6', conducted: '#10b981' };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Logout</button>
      </div>

      <h2>All Workshop Requests</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {requests.length === 0 && <p style={{ color: '#888' }}>No requests yet.</p>}

      {requests.map((r) => (
        <div key={r._id} style={{ border: '1px solid #e5e5e5', borderRadius: '8px', padding: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>{r.topic}</strong>
            <span style={{ color: statusColor[r.status], fontWeight: 'bold', textTransform: 'capitalize' }}>{r.status}</span>
          </div>
          <p style={{ margin: '0.3rem 0', color: '#555', fontSize: '0.9rem' }}>
            School: {r.school?.schoolName || r.school?.name} • Class {r.className} • {r.studentCount} students • {new Date(r.preferredDate).toLocaleDateString()}
          </p>

          {r.status === 'pending' && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <select
                onChange={(e) => setSelectedTrainer({ ...selectedTrainer, [r._id]: e.target.value })}
                style={{ padding: '0.5rem', flex: 1 }}
              >
                <option value="">Select trainer...</option>
                {trainers.map((t) => (
                  <option key={t._id} value={t._id}>{t.name} ({t.email})</option>
                ))}
              </select>
              <button onClick={() => handleAssign(r._id)} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                Assign
              </button>
            </div>
          )}

          {r.assignedTrainer && (
            <p style={{ fontSize: '0.85rem', color: '#333', marginTop: '0.4rem' }}>
              Assigned to: <strong>{r.assignedTrainer.name}</strong>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;