
// Create new client type file
export interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  address?: string;
  notes?: string;
  tags?: string[];
  isDropped?: boolean;
  droppedDate?: string;
  droppedReason?: string;
  assignedAttorneyId?: string;
  createdAt: string;
  updatedAt: string;
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
