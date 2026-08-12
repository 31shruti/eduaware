import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">EduAware</div>
        <div className="nav-links">
          <span onClick={() => scrollTo('home')}>Home</span>
          <span onClick={() => scrollTo('what-we-do')}>What We Do</span>
          <span onClick={() => scrollTo('careers')}>Careers</span>
          <span onClick={() => scrollTo('contact')}>Contact</span>
        </div>
      </nav>

      {/* HOME / HERO */}
      <section id="home" className="hero">
        <h1>Life Skills Education, Managed End to End</h1>
        <p>
          EduAware helps schools deliver and measure workshops on cybersecurity, mental health,
          financial literacy, and more — all from one platform.
        </p>
        <p className="hero-sub">Sign in as:</p>
        <div className="role-buttons">
          <button onClick={() => navigate('/school-auth')}>School</button>
          <button onClick={() => navigate('/trainer-auth')}>Trainer</button>
          <button onClick={() => navigate('/student-auth')}>Student</button>
          <button onClick={() => navigate('/admin-auth')}>Admin</button>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section id="what-we-do" className="section">
        <h2>What We Do</h2>
        <div className="cards">
          <div className="card">
            <h3>For Schools</h3>
            <p>Book expert-led workshops, track attendance, and get performance reports — no more WhatsApp coordination.</p>
          </div>
          <div className="card">
            <h3>For Trainers</h3>
            <p>Manage your assigned sessions, mark attendance, and launch quizzes directly from your dashboard.</p>
          </div>
          <div className="card">
            <h3>For Students</h3>
            <p>Take quizzes after each workshop and earn verified digital certificates for what you've learned.</p>
          </div>
        </div>
      </section>

      {/* CAREERS */}
      <section id="careers" className="section alt">
        <h2>Careers</h2>
        <p>We're an early-stage team building the operating system for life-skills education in schools.</p>
        <p>Interested in joining as a trainer, developer, or partner? Reach out below.</p>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <h2>Contact</h2>
        <p>Have questions or want a demo? Email us at <strong>hello@eduaware.in</strong></p>
      </section>

      <footer className="footer">© 2026 EduAware. All rights reserved.</footer>
    </div>
  );
}

export default Landing;