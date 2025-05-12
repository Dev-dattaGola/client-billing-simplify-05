
export interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  address?: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  
  // Extended client properties
  accountNumber?: string;
  dateOfBirth?: string;
  profilePhoto?: string;
  caseStatus?: string;
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

export interface ClientFilterParams {
  search?: string;
  tag?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}
