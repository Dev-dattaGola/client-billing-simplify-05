
export interface Client {
  id: string;
  accountNumber?: string;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  address?: string;
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Additional patient fields
  dateOfBirth?: string;
  profilePhoto?: string;
  caseStatus?: 'Active Treatment' | 'Initial Consultation' | 'Case Review' | 'Settlement Negotiation' | 'Closed';
  assignedAttorneyId?: string;
  accidentDate?: string;
  accidentLocation?: string;
  injuryType?: string;
  caseDescription?: string;
  insuranceCompany?: string;
  insurancePolicyNumber?: string;
  insuranceAdjusterName?: string;
  dateRegistered?: string;
}

export type ClientFormData = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;

export interface ClientFilterParams {
  search: string;
  tag?: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
}
