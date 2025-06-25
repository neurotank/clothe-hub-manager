
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
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Error de login",
          description: error.message,
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
    }

    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('SignUp error:', error);
        toast({
          title: "Error de registro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('SignUp successful:', data);
        toast({
          title: "Registro exitoso",
          description: "Revisa tu email para confirmar la cuenta",
        });
      }
    } catch (error) {
      console.error('SignUp exception:', error);
      toast({
        title: "Error",
        description: "Error inesperado durante el registro",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">ConsignApp</CardTitle>
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
            
            <div className="space-y-2">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleSignUp}
                disabled={loading}
              >
                Registrarse
              </Button>
            </div>
          </form>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-xs text-blue-600">
              <strong>Credenciales de prueba:</strong><br />
              Email: admin@consignapp.com<br />
              Contraseña: password123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
