
export interface User {
  id: string;
  name?: string;
  email: string;
  role: 'superadmin' | 'admin' | 'attorney' | 'client';
  firmId?: string;
  assignedAttorneyId?: string;
  assignedClientIds?: string[];
  permissions: string[];
  metadata?: Record<string, any>;
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
