import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();

  if (!user) {
    // Not logged in at all
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Logged in, but wrong role trying to access someone else's dashboard
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;