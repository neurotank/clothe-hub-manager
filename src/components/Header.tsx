
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isOnSoldGarmentsPage = location.pathname === '/admin/sold-garments';

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">ConsignApp</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {!isOnSoldGarmentsPage && (
              <Button
                variant="outline"
                onClick={() => navigate('/admin/sold-garments')}
                className="hidden sm:flex items-center"
              >
                <Users className="w-4 h-4 mr-2" />
                Prendas Vendidas
              </Button>
            )}
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
