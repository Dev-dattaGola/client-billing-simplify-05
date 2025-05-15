
export interface User {
  id: string;
  email: string;
  role?: string;
  name?: string; 
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (credentials: LoginCredentials) => Promise<User | null>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  updateAuthState: () => void;
}
