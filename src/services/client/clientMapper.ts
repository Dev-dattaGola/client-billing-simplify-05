
import { Client } from '@/types/client';

export class ClientMapper {
  // Helper function to convert database client to frontend client
  static mapDbClientToClient(dbClient: any): Client {
    return {
      id: dbClient.id,
      user_id: dbClient.user_id || dbClient.id,
      fullName: dbClient.full_name || `${dbClient.first_name || ''} ${dbClient.last_name || ''}`.trim(),
      email: dbClient.email || '',
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
      accountNumber: `A${dbClient.id?.substring(0, 3) || '001'}`,
      dateOfBirth: '',
      profilePhoto: '',
      caseStatus: 'Initial Consultation',
      accidentDate: '',
      accidentLocation: '',
      injuryType: '',
      caseDescription: '',
      insuranceCompany: '',
      insurancePolicyNumber: '',
      insuranceAdjusterName: '',
      dateRegistered: dbClient.created_at?.split('T')[0] || ''
    };
  }
}
