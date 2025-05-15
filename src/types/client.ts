
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  status: 'active' | 'inactive' | 'dropped';
  assignedAttorney: string;
  caseType: string;
  caseStatus: string;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt?: string;
  dropReason?: string;
  
  // Extended information for client management
  fullName?: string; // Added for compatibility with existing components
  accountNumber?: string;
  companyName?: string;
  tags?: string[];
  notes?: string;
  profilePhoto?: string;
  dateRegistered?: string;
  assignedAttorneyId?: string;
  accidentDate?: string;
  accidentLocation?: string;
  injuryType?: string;
  caseDescription?: string;
  insuranceCompany?: string;
  insurancePolicyNumber?: string;
  insuranceAdjusterName?: string;
}

export interface ClientFilterParams {
  search?: string;
  tag?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}
