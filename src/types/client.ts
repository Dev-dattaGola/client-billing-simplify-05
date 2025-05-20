
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
  // Auth fields
  password?: string; // Used when creating a new client with auth
  user_id?: string; // Reference to the auth.users record
  // Dropped client fields
  isDropped?: boolean;
  droppedDate?: string;
  droppedReason?: string;
  // Database field naming compatibility (camelCase/snake_case)
  full_name?: string;
  company_name?: string;
  is_dropped?: boolean;
  dropped_date?: string;
  dropped_reason?: string;
  assigned_attorney_id?: string;
  created_at?: string;
  updated_at?: string;
}

export type ClientFormData = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;

export interface ClientFilterParams {
  search: string;
  tag?: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  showDropped?: boolean;
}
