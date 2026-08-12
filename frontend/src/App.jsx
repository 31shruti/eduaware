import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import StudentAuth from './pages/auth/StudentAuth';
import TrainerAuth from './pages/auth/TrainerAuth';
import SchoolAuth from './pages/auth/SchoolAuth';
import AdminAuth from './pages/auth/AdminAuth';
import SchoolDashboard from './pages/school/SchoolDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import StudentDashboard from './pages/student/StudentDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/student-auth" element={<StudentAuth />} />
          <Route path="/trainer-auth" element={<TrainerAuth />} />
          <Route path="/school-auth" element={<SchoolAuth />} />
          <Route path="/admin-auth" element={<AdminAuth />} />
          <Route path="/school-dashboard" element={<SchoolDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;