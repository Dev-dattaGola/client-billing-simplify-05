
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'attorney' | 'client';
  firmId?: string;
  assignedAttorneyId?: string;
  assignedClientIds?: string[];
  permissions: string[];
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    role?: string;
  };
}
