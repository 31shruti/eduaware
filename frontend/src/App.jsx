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
import ProtectedRoute from './components/ProtectedRoute';

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

          <Route
            path="/school-dashboard"
            element={
              <ProtectedRoute allowedRole="school">
                <SchoolDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer-dashboard"
            element={
              <ProtectedRoute allowedRole="trainer">
                <TrainerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;