import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { COMMON } from '../constants/my';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">{COMMON.loading}</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
