
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, BarChart3, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-900">ConsignApp</h1>
            
            <nav className="hidden md:flex space-x-4">
              <Button
                variant={isActive('/dashboard') ? 'default' : 'ghost'}
                onClick={() => navigate('/dashboard')}
                className="text-sm"
              >
                <Package className="w-4 h-4 mr-2" />
                Proveedores
              </Button>
              
              {!isMobile && (
                <Button
                  variant={isActive('/admin') ? 'default' : 'ghost'}
                  onClick={() => navigate('/admin')}
                  className="text-sm"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Administrador
                </Button>
              )}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="text-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
