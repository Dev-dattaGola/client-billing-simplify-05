
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive' | 'dropped';
  assignedAttorney: string;
  caseType: string;
  caseStatus: string;
  dateOfBirth?: string;
  createdAt: string;
  dropReason?: string;
}
