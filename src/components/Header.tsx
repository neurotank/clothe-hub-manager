
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, BarChart3, Package, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSupabaseData } from '../hooks/useSupabaseData';

const Header = () => {
  const { signOut, user } = useAuth();
  const { userRole } = useSupabaseData();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  // Only admin role can access admin dashboard
  const isAdmin = userRole === 'admin';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-900">StockManager</h1>
            
            <nav className="hidden md:flex space-x-4">
              <Button
                variant={isActive('/dashboard') ? 'default' : 'ghost'}
                onClick={() => navigate('/dashboard')}
                className="text-sm"
              >
                <Package className="w-4 h-4 mr-2" />
                Proveedores
              </Button>
              
              {isAdmin && (
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
          
          <div className="flex items-center space-x-2">
            {/* Mobile admin button - only show on dashboard and if user is admin */}
            {isMobile && location.pathname === '/dashboard' && isAdmin && (
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
                className="text-xs px-2"
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
            )}
            
            {/* Logout button - icon only on mobile, full button on desktop */}
            {isMobile ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="px-2"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="text-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
