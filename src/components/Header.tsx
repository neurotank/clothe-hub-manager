
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, isAdmin } = useAuth();

  const handleLogout = async () => {
    await logout();
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
              onClick={() => isAdmin ? navigate('/dashboard') : navigate('/my-garments')}
            >
              ConsignApp
            </h1>
            
            {/* Navegación para todos los usuarios autenticados */}
            <nav className="hidden md:flex space-x-4">
              <Button
                variant={isActiveRoute('/dashboard') ? 'default' : 'ghost'}
                onClick={() => navigate('/dashboard')}
                className={isActiveRoute('/dashboard') ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Dashboard
              </Button>
              
              {/* Solo admin puede ver administración */}
              {isAdmin && (
                <Button
                  variant={isActiveRoute('/admin/sold-garments') ? 'default' : 'ghost'}
                  onClick={() => navigate('/admin/sold-garments')}
                  className={isActiveRoute('/admin/sold-garments') ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  Administración
                </Button>
              )}
              
              {/* Mis Prendas para suppliers */}
              {!isAdmin && (
                <Button
                  variant={isActiveRoute('/my-garments') ? 'default' : 'ghost'}
                  onClick={() => navigate('/my-garments')}
                  className={isActiveRoute('/my-garments') ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  Mis Prendas
                </Button>
              )}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user?.name} ({user?.role === 'admin' ? 'Administrador' : 'Vendedor'})
            </span>
            
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="text-gray-700 hover:text-gray-900"
            >
              Cerrar sesión
            </Button>
          </div>
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
            
            {isAdmin && (
              <Button
                variant={isActiveRoute('/admin/sold-garments') ? 'default' : 'ghost'}
                onClick={() => navigate('/admin/sold-garments')}
                size="sm"
                className={isActiveRoute('/admin/sold-garments') ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Admin
              </Button>
            )}
            
            {!isAdmin && (
              <Button
                variant={isActiveRoute('/my-garments') ? 'default' : 'ghost'}
                onClick={() => navigate('/my-garments')}
                size="sm"
                className={isActiveRoute('/my-garments') ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Mis Prendas
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
