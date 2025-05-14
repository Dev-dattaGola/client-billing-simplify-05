
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'attorney' | 'client';
  firmId?: string;
  assignedAttorneyId?: string;
  assignedClientIds?: string[];
  permissions: string[];
  isDropped?: boolean;
  droppedReason?: string;
  droppedAt?: string;
}
