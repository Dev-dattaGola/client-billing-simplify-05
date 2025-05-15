
import { useToast } from "@/hooks/use-toast";

export type Attorney = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'Partner' | 'Associate' | 'Paralegal' | 'Intern';
  barNumber?: string;
  specialization?: string;
  bio?: string;
  profileImage?: string;
  officeLocation?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// Mock data for attorneys
const mockAttorneys: Attorney[] = [
  {
    id: '1',
    firstName: 'Rachel',
    lastName: 'Green',
    email: 'rgreen@lyzlaw.com',
    phone: '555-123-4567',
    role: 'Partner',
    barNumber: 'BAR123456',
    specialization: 'Corporate Law',
    bio: 'Senior partner with 15 years of corporate law experience',
    profileImage: '',
    officeLocation: 'Main Office, Floor 12',
    isActive: true,
    createdAt: '2022-01-15T00:00:00Z',
    updatedAt: '2023-03-20T00:00:00Z'
  },
  {
    id: '2',
    firstName: 'Mark',
    lastName: 'Johnson',
    email: 'mjohnson@lyzlaw.com',
    phone: '555-987-6543',
    role: 'Associate',
    barNumber: 'BAR789012',
    specialization: 'Litigation',
    bio: 'Associate specializing in commercial litigation',
    profileImage: '',
    officeLocation: 'Main Office, Floor 10',
    isActive: true,
    createdAt: '2022-03-10T00:00:00Z',
    updatedAt: '2023-02-15T00:00:00Z'
  },
  {
    id: '3',
    firstName: 'Lisa',
    lastName: 'Wong',
    email: 'lwong@lyzlaw.com',
    phone: '555-456-7890',
    role: 'Paralegal',
    specialization: 'Real Estate Law',
    bio: 'Paralegal with 8 years of experience in real estate transactions',
    profileImage: '',
    officeLocation: 'Downtown Office',
    isActive: true,
    createdAt: '2021-06-22T00:00:00Z',
    updatedAt: '2023-01-05T00:00:00Z'
  },
  {
    id: '4',
    firstName: 'James',
    lastName: 'Rodriguez',
    email: 'jrodriguez@lyzlaw.com',
    phone: '555-222-3333',
    role: 'Intern',
    bio: 'Law student focusing on criminal defense',
    profileImage: '',
    officeLocation: 'Main Office, Floor 8',
    isActive: true,
    createdAt: '2023-05-15T00:00:00Z',
    updatedAt: '2023-05-15T00:00:00Z'
  }
];

export const attorneysApi = {
  // Get all attorneys
  getAttorneys: async (): Promise<Attorney[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...mockAttorneys];
  },
  
  // Get attorney by ID
  getAttorney: async (id: string): Promise<Attorney | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const attorney = mockAttorneys.find(a => a.id === id);
    return attorney || null;
  },
  
  // Create a new attorney
  createAttorney: async (attorneyData: Omit<Attorney, 'id' | 'createdAt' | 'updatedAt'>): Promise<Attorney> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAttorney: Attorney = {
      ...attorneyData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newAttorney;
  },
  
  // Update an attorney
  updateAttorney: async (id: string, attorneyData: Partial<Attorney>): Promise<Attorney | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const attorney = mockAttorneys.find(a => a.id === id);
    if (!attorney) {
      return null;
    }
    
    const updatedAttorney: Attorney = {
      ...attorney,
      ...attorneyData,
      updatedAt: new Date().toISOString()
    };
    
    return updatedAttorney;
  },
  
  // Delete an attorney
  deleteAttorney: async (id: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, this would remove the attorney from the database
    // or mark them as deleted
    return true;
  }
};
