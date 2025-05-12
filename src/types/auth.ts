
export interface User {
  id: string;
  email: string;
  role?: string;
  firmId?: string;
  permissions?: string[];
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    role?: string;
  };
  // Name is now optional since it seems it might not always be present
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
