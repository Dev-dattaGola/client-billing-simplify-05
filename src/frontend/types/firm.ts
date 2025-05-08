
export interface Firm {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  email: string;
  website?: string;
  adminId?: string;
  status: 'active' | 'inactive' | 'suspended';
  subscriptionPlan?: string;
  subscriptionStatus?: 'active' | 'expired' | 'trial';
  trialEndsAt?: Date;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
}
