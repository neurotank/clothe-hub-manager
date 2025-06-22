
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 
              className="text-xl font-bold text-gray-900 cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              ConsignApp
            </h1>
            
            <nav className="hidden md:flex space-x-4">
              <Button
                variant={isActiveRoute('/dashboard') ? 'default' : 'ghost'}
                onClick={() => navigate('/dashboard')}
                className={isActiveRoute('/dashboard') ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Dashboard
              </Button>
              <Button
                variant={isActiveRoute('/admin/sold-garments') ? 'default' : 'ghost'}
                onClick={() => navigate('/admin/sold-garments')}
                className={isActiveRoute('/admin/sold-garments') ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Administración
              </Button>
            </nav>
          </div>
          
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="text-gray-700 hover:text-gray-900"
          >
            Cerrar sesión
          </Button>
        </div>
        
        {/* Mobile navigation */}
        <div className="md:hidden pb-4">
          <nav className="flex space-x-2">
            <Button
              variant={isActiveRoute('/dashboard') ? 'default' : 'ghost'}
              onClick={() => navigate('/dashboard')}
              size="sm"
              className={isActiveRoute('/dashboard') ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              Dashboard
            </Button>
            <Button
              variant={isActiveRoute('/admin/sold-garments') ? 'default' : 'ghost'}
              onClick={() => navigate('/admin/sold-garments')}
              size="sm"
              className={isActiveRoute('/admin/sold-garments') ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              Admin
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
