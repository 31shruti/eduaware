import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

function StudentAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', className: '' });
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
        navigate('/student-dashboard');
      } else {
        const res = await api.post('/auth/register', { ...form, role: 'student' });
        login(res.data);
        navigate('/student-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f59e0b, #ec4899, #8b5cf6)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      color: 'white',
    }}>
      <h1 style={{ marginBottom: '0.25rem', fontSize: '2.2rem' }}>🎓 EduAware</h1>
      <p style={{ marginBottom: '2rem', fontWeight: 'bold' }}>
        {isLogin ? 'Welcome back!' : "Let's get you started!"}
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem',
          width: '300px',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        }}
      >
        {!isLogin && (
          <>
            <input name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required style={inputStyle} />
            <input name="className" placeholder="Class (e.g. 10th)" value={form.className} onChange={handleChange} required style={inputStyle} />
          </>
        )}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={inputStyle} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={inputStyle} />
        {error && <p style={{ color: '#dc2626', fontSize: '0.85rem' }}>{error}</p>}
        <button type="submit" style={buttonStyle}>
          {isLogin ? '🚀 Log In' : '✨ Register'}
        </button>
      </form>

      <p style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
        {isLogin ? "New here? " : 'Already have an account? '}
        <span onClick={() => setIsLogin(!isLogin)} style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}>
          {isLogin ? 'Register' : 'Log In'}
        </span>
      </p>
    </div>
  );
}

const inputStyle = {
  padding: '0.75rem',
  borderRadius: '10px',
  border: '2px solid #f3f4f6',
  fontSize: '1rem',
  outline: 'none',
};

const buttonStyle = {
  padding: '0.8rem',
  borderRadius: '10px',
  border: 'none',
  background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
  marginTop: '0.3rem',
};

export default StudentAuth;