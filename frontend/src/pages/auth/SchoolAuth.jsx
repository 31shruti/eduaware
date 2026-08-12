import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

function SchoolAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', schoolName: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { email: form.email, password: form.password });
        login(res.data);
        navigate('/school-dashboard');
      } else {
        const res = await api.post('/auth/register', { ...form, role: 'school' });
        login(res.data);
        navigate('/school-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>EduAware — School</h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>{isLogin ? 'Log in to your account' : 'Register your school'}</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '300px' }}>
        {!isLogin && (
          <>
            <input name="name" placeholder="Coordinator Name" value={form.name} onChange={handleChange} required style={inputStyle} />
            <input name="schoolName" placeholder="School Name" value={form.schoolName} onChange={handleChange} required style={inputStyle} />
          </>
        )}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={inputStyle} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={inputStyle} />
        {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
        <button type="submit" style={buttonStyle}>{isLogin ? 'Log In' : 'Register'}</button>
      </form>

      <p style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <span onClick={() => setIsLogin(!isLogin)} style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}>
          {isLogin ? 'Register' : 'Log In'}
        </span>
      </p>
    </div>
  );
}

const inputStyle = { padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' };
const buttonStyle = { padding: '0.75rem', borderRadius: '6px', border: 'none', backgroundColor: '#333', color: 'white', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' };

export default SchoolAuth;