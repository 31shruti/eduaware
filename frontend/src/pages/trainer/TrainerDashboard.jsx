import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

function TrainerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([]);
  const [attendanceInput, setAttendanceInput] = useState({});
  const [quizForm, setQuizForm] = useState({}); // { [workshopId]: { questions: [...] } }
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchWorkshops = async () => {
    try {
      const res = await api.get('/workshops/trainer');
      setWorkshops(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMarkAttendance = async (workshopId) => {
    setError('');
    const count = attendanceInput[workshopId];
    if (!count) {
      setError('Enter number of students present');
      return;
    }
    try {
      await api.put(`/workshops/${workshopId}/attendance`, { studentsPresent: Number(count) });
      setSuccessMsg('Attendance marked!');
      fetchWorkshops();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  // --- Quiz builder helpers ---
  const initQuiz = (workshopId) => {
    setQuizForm({
      ...quizForm,
      [workshopId]: {
        questions: [{ questionText: '', options: ['', '', '', ''], correctOption: 0 }],
      },
    });
  };

  const updateQuestion = (workshopId, qIndex, field, value) => {
    const updated = { ...quizForm };
    updated[workshopId].questions[qIndex][field] = value;
    setQuizForm(updated);
  };

  const updateOption = (workshopId, qIndex, optIndex, value) => {
    const updated = { ...quizForm };
    updated[workshopId].questions[qIndex].options[optIndex] = value;
    setQuizForm(updated);
  };

  const addQuestion = (workshopId) => {
    const updated = { ...quizForm };
    updated[workshopId].questions.push({ questionText: '', options: ['', '', '', ''], correctOption: 0 });
    setQuizForm(updated);
  };

  const submitQuiz = async (workshopId) => {
    setError('');
    try {
      await api.post('/quiz', { workshopId, questions: quizForm[workshopId].questions });
      setSuccessMsg('Quiz created!');
      const updated = { ...quizForm };
      delete updated[workshopId];
      setQuizForm(updated);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const statusColor = { pending: '#f59e0b', assigned: '#3b82f6', conducted: '#10b981' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1d4ed8', color: 'white', fontFamily: 'sans-serif', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', maxWidth: '900px', margin: '0 auto 2rem' }}>
        <h1>Welcome, {user?.name}</h1>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Logout</button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2>Your Assigned Workshops</h2>
        {error && <p style={{ color: '#fca5a5' }}>{error}</p>}
        {successMsg && <p style={{ color: '#bbf7d0' }}>{successMsg}</p>}
        {workshops.length === 0 && <p>No workshops assigned yet.</p>}

        {workshops.map((w) => (
          <div key={w._id} style={{ backgroundColor: 'white', color: '#1a1a1a', borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{w.topic}</strong>
              <span style={{ color: statusColor[w.status], fontWeight: 'bold', textTransform: 'capitalize' }}>{w.status}</span>
            </div>
            <p style={{ margin: '0.3rem 0', color: '#555', fontSize: '0.9rem' }}>
              School: {w.school?.schoolName || w.school?.name} • Class {w.className} • {w.studentCount} students • {new Date(w.preferredDate).toLocaleDateString()}
            </p>

            {/* Mark attendance — only if assigned and not yet conducted */}
            {w.status === 'assigned' && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <input
                  type="number"
                  placeholder="Students present"
                  onChange={(e) => setAttendanceInput({ ...attendanceInput, [w._id]: e.target.value })}
                  style={{ padding: '0.5rem', flex: 1, border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <button onClick={() => handleMarkAttendance(w._id)} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                  Mark Attendance
                </button>
              </div>
            )}

            {/* Create quiz — only if conducted */}
            {w.status === 'conducted' && !quizForm[w._id] && (
              <button onClick={() => initQuiz(w._id)} style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                + Create Quiz
              </button>
            )}

            {quizForm[w._id] && (
              <div style={{ marginTop: '1rem', border: '1px solid #ddd', borderRadius: '6px', padding: '1rem' }}>
                <h4 style={{ marginTop: 0 }}>Build Quiz</h4>
                {quizForm[w._id].questions.map((q, qIndex) => (
                  <div key={qIndex} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                    <input
                      placeholder={`Question ${qIndex + 1}`}
                      value={q.questionText}
                      onChange={(e) => updateQuestion(w._id, qIndex, 'questionText', e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <input
                          type="radio"
                          name={`correct-${w._id}-${qIndex}`}
                          checked={q.correctOption === optIndex}
                          onChange={() => updateQuestion(w._id, qIndex, 'correctOption', optIndex)}
                        />
                        <input
                          placeholder={`Option ${optIndex + 1}`}
                          value={opt}
                          onChange={(e) => updateOption(w._id, qIndex, optIndex, e.target.value)}
                          style={{ flex: 1, padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                      </div>
                    ))}
                  </div>
                ))}
                <button onClick={() => addQuestion(w._id)} style={{ marginRight: '0.5rem', padding: '0.4rem 0.8rem', cursor: 'pointer' }}>
                  + Add Question
                </button>
                <button onClick={() => submitQuiz(w._id)} style={{ padding: '0.4rem 0.8rem', cursor: 'pointer', backgroundColor: '#1d4ed8', color: 'white', border: 'none', borderRadius: '4px' }}>
                  Save Quiz
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrainerDashboard;