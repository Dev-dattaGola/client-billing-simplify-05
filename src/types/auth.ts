
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  firmId?: string;
  permissions?: string[];
  // Add any other properties used across the application
  user_metadata?: {
    first_name?: string;
    last_name?: string;
  };
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
