
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Panel de Administración</h1>
          <p className="text-sm text-gray-500">Gestión de Proveedores y Prendas</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Bienvenido, <span className="font-medium">{user?.name}</span>
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
            className="hover:bg-gray-50"
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
