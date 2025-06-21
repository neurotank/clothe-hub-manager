
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirigir automáticamente al dashboard
  return <Navigate to="/dashboard" replace />;
};

export default Index;
