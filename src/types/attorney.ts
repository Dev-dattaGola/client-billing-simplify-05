
export interface Attorney {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  specialization?: string;
  bio?: string;
  office_location?: string;
  yearsOfExperience?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
