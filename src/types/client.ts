
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
  updatedAt: dbClient.updated_at
});
