import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [email, setEmail] = useState('admin@consignapp.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [isCreatingUsers, setIsCreatingUsers] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const createTestUsers = async () => {
    setIsCreatingUsers(true);
    console.log('Creating test users...');
    
    const testUsers = [
      { email: 'admin@consignapp.com', password: 'password123' },
      { email: 'vendedor1@consignapp.com', password: 'password123' },
      { email: 'vendedor2@consignapp.com', password: 'password123' }
    ];

    for (const user of testUsers) {
      try {
        console.log(`Creating user: ${user.email}`);
        const { error } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });

        if (error && !error.message.includes('already registered')) {
          console.error(`Error creating user ${user.email}:`, error);
        } else {
          console.log(`User ${user.email} created or already exists`);
        }
      } catch (error) {
        console.error(`Exception creating user ${user.email}:`, error);
      }
    }

    setIsCreatingUsers(false);
    toast({
      title: "Usuarios de prueba",
      description: "Los usuarios de prueba han sido creados. Ahora puedes iniciar sesión.",
    });
  };

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
          errorMessage = "Credenciales inválidas. ¿Has creado los usuarios de prueba?";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Email no confirmado. Por favor confirma tu email o desactiva la confirmación en Supabase";
        } else {
          errorMessage = error.message;
        }
        
        toast({
          title: "Error de login",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.log('Login successful:', data);
        toast({
          title: "Login exitoso",
          description: "Bienvenido a ConsignApp",
        });
        navigate('/dashboard');
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
          <CardTitle className="text-center">ConsignApp</CardTitle>
          <p className="text-center text-gray-600">Inicia sesión para continuar</p>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button 
              onClick={createTestUsers}
              disabled={isCreatingUsers}
              className="w-full bg-green-600 hover:bg-green-700 mb-4"
            >
              {isCreatingUsers ? 'Creando usuarios...' : 'Crear usuarios de prueba'}
            </Button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@consignapp.com"
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
                onClick={() => setCredentials('admin@consignapp.com', 'password123')}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">Admin</span>
                  <span className="text-xs text-gray-500">admin@consignapp.com</span>
                </div>
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                className="w-full text-left justify-start"
                onClick={() => setCredentials('vendedor1@consignapp.com', 'password123')}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">Vendedor 1</span>
                  <span className="text-xs text-gray-500">vendedor1@consignapp.com</span>
                </div>
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                className="w-full text-left justify-start"
                onClick={() => setCredentials('vendedor2@consignapp.com', 'password123')}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">Vendedor 2</span>
                  <span className="text-xs text-gray-500">vendedor2@consignapp.com</span>
                </div>
              </Button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-md">
            <p className="text-xs text-yellow-700">
              <strong>Importante:</strong> Primero haz clic en "Crear usuarios de prueba" para registrar los usuarios en Supabase Auth, luego podrás hacer login.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
