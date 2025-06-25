
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('admin@stockmanager.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      console.log('User already logged in, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Attempting login with:', email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        
        let errorMessage = "Error durante el login";
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Credenciales inválidas";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Email no confirmado";
        } else {
          errorMessage = error.message;
        }
        
        toast({
          title: "Error de login",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.log('Login successful, user data:', data.user);
        toast({
          title: "Login exitoso",
          description: "Bienvenido a StockManager",
        });
      }
    } catch (error) {
      console.error('Login exception:', error);
      toast({
        title: "Error",
        description: "Error inesperado durante el login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setCredentials = (newEmail: string, newPassword: string) => {
    setEmail(newEmail);
    setPassword(newPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">StockManager</CardTitle>
          <p className="text-center text-gray-600">Inicia sesión para continuar</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@stockmanager.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
          
          <div className="mt-6 space-y-2">
            <p className="text-sm font-medium text-gray-700 mb-2">Usuarios disponibles:</p>
            
            <div className="space-y-2">
              <Button 
                type="button"
                variant="outline"
                className="w-full text-left justify-start"
                onClick={() => setCredentials('admin@stockmanager.com', 'password123')}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">Admin</span>
                  <span className="text-xs text-gray-500">admin@stockmanager.com / password123</span>
                </div>
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                className="w-full text-left justify-start"
                onClick={() => setCredentials('vendedor1@stockmanager.com', 'password123')}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">Vendedor 1</span>
                  <span className="text-xs text-gray-500">vendedor1@stockmanager.com / password123</span>
                </div>
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                className="w-full text-left justify-start"
                onClick={() => setCredentials('vendedor2@stockmanager.com', 'password123')}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">Vendedor 2</span>
                  <span className="text-xs text-gray-500">vendedor2@stockmanager.com / password123</span>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
