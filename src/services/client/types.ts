
import { Client } from '@/types/client';

export interface CreateClientData {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  address?: string;
  tags?: string[];
  notes?: string;
  assignedAttorneyId?: string;
  password?: string;
}

export interface UpdateClientData extends Partial<CreateClientData> {
  id: string;
}
