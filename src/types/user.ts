
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'attorney' | 'client';
  firmId?: string;
  assignedAttorneyId?: string;
  assignedClientIds?: string[];
  permissions: string[];
  metadata?: Record<string, any>;
  // Added fields for firm management
  managedFirmId?: string;
  isActive?: boolean;
}
