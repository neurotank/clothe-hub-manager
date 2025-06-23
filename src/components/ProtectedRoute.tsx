
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si es solo para admin y el usuario no es admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/my-garments" replace />;
  }

  // Si es supplier y está intentando acceder a rutas de admin
  if (user?.role === 'supplier' && window.location.pathname.startsWith('/dashboard')) {
    return <Navigate to="/my-garments" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
