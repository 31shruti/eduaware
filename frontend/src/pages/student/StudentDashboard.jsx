import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const fetchQuizzes = async () => {
    try {
      const res = await api.get('/quiz/available');
      setQuizzes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openQuiz = async (quizId) => {
    setError('');
    setResult(null);
    try {
      const res = await api.get(`/quiz/${quizId}`);
      setActiveQuiz(res.data);
      setAnswers({});
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const selectAnswer = (qIndex, optIndex) => {
    setAnswers({ ...answers, [qIndex]: optIndex });
  };

  const submitQuiz = async () => {
    setError('');
    const answerArray = activeQuiz.questions.map((_, i) => answers[i] ?? -1);
    try {
      const res = await api.post(`/quiz/${activeQuiz._id}/submit`, { answers: answerArray });
      setResult(res.data);
      setActiveQuiz(null);
      fetchQuizzes();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f59e0b, #ec4899, #8b5cf6)',
      fontFamily: 'sans-serif',
      padding: '2rem',
      color: 'white',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '700px', margin: '0 auto 2rem' }}>
        <h1>🎓 Hi, {user?.name}!</h1>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '8px', border: 'none' }}>Logout</button>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {error && <p style={{ color: '#fee2e2', fontWeight: 'bold' }}>{error}</p>}

        {/* RESULT VIEW */}
        {result && (
          <div style={{ backgroundColor: 'white', color: '#1a1a1a', borderRadius: '16px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2>{result.passed ? '🎉 You Passed!' : '📚 Keep Learning!'}</h2>
            <p style={{ fontSize: '1.2rem' }}>Score: {result.score} / {result.total}</p>
            {result.passed && result.certificate && (
              <div style={{ marginTop: '1.5rem', border: '3px double #f59e0b', borderRadius: '12px', padding: '1.5rem' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#888' }}>CERTIFICATE OF COMPLETION</p>
                <h3 style={{ margin: '0.5rem 0' }}>{user?.name}</h3>
                <p style={{ margin: 0 }}>Score: {result.certificate.score}/{result.certificate.totalQuestions}</p>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: '#888' }}>
                  Issued {new Date(result.certificate.issuedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        )}

        {/* QUIZ TAKING VIEW */}
        {activeQuiz && (
          <div style={{ backgroundColor: 'white', color: '#1a1a1a', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ marginTop: 0 }}>{activeQuiz.workshop?.topic} Quiz</h3>
            {activeQuiz.questions.map((q, qIndex) => (
              <div key={q._id} style={{ marginBottom: '1.25rem' }}>
                <p style={{ fontWeight: 'bold' }}>{qIndex + 1}. {q.questionText}</p>
                {q.options.map((opt, optIndex) => (
                  <label key={optIndex} style={{ display: 'block', marginBottom: '0.3rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name={`q-${qIndex}`}
                      checked={answers[qIndex] === optIndex}
                      onChange={() => selectAnswer(qIndex, optIndex)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ))}
            <button
              onClick={submitQuiz}
              style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #f59e0b, #ec4899)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Submit Quiz
            </button>
          </div>
        )}

        {/* AVAILABLE QUIZZES LIST */}
        {!activeQuiz && (
          <>
            <h2>Available Quizzes</h2>
            {quizzes.length === 0 && <p>No quizzes available yet — check back after your workshop!</p>}
            {quizzes.map((q) => (
              <div key={q._id} style={{ backgroundColor: 'white', color: '#1a1a1a', borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{q.workshop?.topic}</strong>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>{q.questions.length} questions</p>
                </div>
                <button onClick={() => openQuiz(q._id)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #f59e0b, #ec4899)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                  Take Quiz
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;