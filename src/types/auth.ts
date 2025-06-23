
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'supplier';
  auth_user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: User | null;
  session: any;
  login: (email: string, password: string) => Promise<{ error?: any }>;
  loginWithGoogle: () => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSupplier: boolean;
}
