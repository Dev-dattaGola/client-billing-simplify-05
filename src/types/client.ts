
export interface Client {
  id: string;
  user_id?: string;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  address?: string;
  tags?: string[];
  notes?: string;
  assignedAttorneyId?: string;
  isDropped?: boolean;
  droppedDate?: string;
  droppedReason?: string;
  createdAt: string;
  updatedAt: string;
  password?: string; // Only used for creation/updates, not stored
  
  // Extended information from Patient model
  accountNumber?: string;
  dateOfBirth?: string;
  profilePhoto?: string;
  caseStatus?: string;
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

// Helper function to map database client to frontend client
export const mapDbClientToClient = (dbClient: any): Client => ({
  id: dbClient.id,
  user_id: dbClient.user_id,
  fullName: dbClient.full_name,
  email: dbClient.email,
  phone: dbClient.phone || '',
  companyName: dbClient.company_name || '',
  address: dbClient.address || '',
  tags: dbClient.tags || [],
  notes: dbClient.notes || '',
  assignedAttorneyId: dbClient.assigned_attorney_id || '',
  isDropped: dbClient.is_dropped || false,
  droppedDate: dbClient.dropped_date,
  droppedReason: dbClient.dropped_reason || '',
  createdAt: dbClient.created_at,
  updatedAt: dbClient.updated_at,
  
  // Extended properties with defaults
  accountNumber: dbClient.account_number || `A${dbClient.id?.substring(0, 3) || '001'}`,
  dateOfBirth: dbClient.date_of_birth || '',
  profilePhoto: dbClient.profile_photo || '',
  caseStatus: dbClient.case_status || 'Initial Consultation',
  accidentDate: dbClient.accident_date || '',
  accidentLocation: dbClient.accident_location || '',
  injuryType: dbClient.injury_type || '',
  caseDescription: dbClient.case_description || '',
  insuranceCompany: dbClient.insurance_company || '',
  insurancePolicyNumber: dbClient.insurance_policy_number || '',
  insuranceAdjusterName: dbClient.insurance_adjuster_name || '',
  dateRegistered: dbClient.date_registered || dbClient.created_at?.split('T')[0] || ''
});
