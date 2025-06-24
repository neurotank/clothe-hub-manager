
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Users } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, isAdmin, switchUser, availableUsers } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleUserSwitch = (userId: string) => {
    if (switchUser) {
      switchUser(userId);
    }
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
            
            {/* Navegación solo para admins */}
            {isAdmin && (
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
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Selector de usuario para desarrollo */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{user?.name} ({user?.role})</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {availableUsers?.map((availableUser) => (
                  <DropdownMenuItem
                    key={availableUser.id}
                    onClick={() => handleUserSwitch(availableUser.id)}
                    className={user?.id === availableUser.id ? 'bg-blue-50' : ''}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{availableUser.name}</span>
                      <span className="text-xs text-gray-500">{availableUser.role}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="text-gray-700 hover:text-gray-900"
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
        
        {/* Mobile navigation - solo para admins */}
        {isAdmin && (
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
        )}
      </div>
    </header>
  );
};

export default Header;
