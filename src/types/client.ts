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
  // Database field mapping compatibility (camelCase/snake_case)
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

// Helper function to convert snake_case DB fields to camelCase for frontend
export function mapDbClientToClient(dbClient: any): Client {
  return {
    id: dbClient.id,
    fullName: dbClient.full_name,
    email: dbClient.email,
    phone: dbClient.phone || '',
    companyName: dbClient.company_name || '',
    address: dbClient.address || '',
    tags: dbClient.tags || [],
    notes: dbClient.notes || '',
    createdAt: dbClient.created_at || new Date().toISOString(),
    updatedAt: dbClient.updated_at || new Date().toISOString(),
    isDropped: dbClient.is_dropped || false,
    droppedDate: dbClient.dropped_date || '',
    droppedReason: dbClient.dropped_reason || '',
    assignedAttorneyId: dbClient.assigned_attorney_id || '',
    user_id: dbClient.user_id || '',
    
    // Keep the original fields for database operations
    full_name: dbClient.full_name,
    company_name: dbClient.company_name,
    is_dropped: dbClient.is_dropped,
    dropped_date: dbClient.dropped_date,
    dropped_reason: dbClient.dropped_reason,
    assigned_attorney_id: dbClient.assigned_attorney_id,
    created_at: dbClient.created_at,
    updated_at: dbClient.updated_at,
  };
}

// Helper function to convert camelCase frontend fields to snake_case for DB
export function mapClientToDbClient(client: Client): any {
  return {
    id: client.id,
    full_name: client.fullName,
    email: client.email,
    phone: client.phone,
    company_name: client.companyName,
    address: client.address,
    tags: client.tags,
    notes: client.notes,
    is_dropped: client.isDropped,
    dropped_date: client.droppedDate,
    dropped_reason: client.droppedReason,
    assigned_attorney_id: client.assignedAttorneyId,
    user_id: client.user_id,
  };
}
