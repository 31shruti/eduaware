import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

function SchoolDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ topic: 'Cybersecurity', preferredDate: '', className: '', studentCount: '' });
  const [error, setError] = useState('');

  const topics = ['Cybersecurity', 'Mental Health', 'AI Literacy', 'Financial Literacy', 'Anti-Bullying', 'Digital Safety'];

  const fetchRequests = async () => {
    try {
      const res = await api.get('/workshops/my');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/workshops', form);
      setForm({ topic: 'Cybersecurity', preferredDate: '', className: '', studentCount: '' });
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
        <h1>Welcome, {user?.name}</h1>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Logout</button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* REQUEST FORM */}
        <div style={{ flex: '1', minWidth: '300px', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '1.5rem' }}>
          <h2 style={{ marginTop: 0 }}>Request a Workshop</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label>
              Topic
              <select name="topic" value={form.topic} onChange={handleChange} style={inputStyle}>
                {topics.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label>
              Preferred Date
              <input type="date" name="preferredDate" value={form.preferredDate} onChange={handleChange} required style={inputStyle} />
            </label>
            <label>
              Class
              <input type="text" name="className" placeholder="e.g. 10th" value={form.className} onChange={handleChange} required style={inputStyle} />
            </label>
            <label>
              Number of Students
              <input type="number" name="studentCount" value={form.studentCount} onChange={handleChange} required style={inputStyle} />
            </label>
            {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
            <button type="submit" style={{ padding: '0.75rem', marginTop: '0.5rem', cursor: 'pointer', backgroundColor: '#1a1a1a', color: 'white', border: 'none', borderRadius: '4px' }}>
              Submit Request
            </button>
          </form>
        </div>

        {/* REQUEST LIST */}
        <div style={{ flex: '1.5', minWidth: '350px' }}>
          <h2>Your Requests</h2>
          {requests.length === 0 && <p style={{ color: '#888' }}>No requests yet.</p>}
          {requests.map((r) => (
            <div key={r._id} style={{ border: '1px solid #e5e5e5', borderRadius: '8px', padding: '1rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{r.topic}</strong>
                <span style={{ color: statusColor[r.status], fontWeight: 'bold', textTransform: 'capitalize' }}>{r.status}</span>
              </div>
              <p style={{ margin: '0.3rem 0', color: '#555', fontSize: '0.9rem' }}>
                Class {r.className} • {r.studentCount} students • {new Date(r.preferredDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const inputStyle = { display: 'block', width: '100%', padding: '0.6rem', marginTop: '0.25rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.95rem' };

export default SchoolDashboard;