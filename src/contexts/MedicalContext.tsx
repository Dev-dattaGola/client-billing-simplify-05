
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Provider, MedicalRecord } from '@/types/medical';
import { useToast } from '@/hooks/use-toast';

// Mock API functions for medical data
const medicalApi = {
  getProviders: async (): Promise<Provider[]> => {
    // Simulate API call with mock data
    return [
      {
        id: "p1",
        name: "City General Hospital",
        type: "hospital",
        address: "123 Main St, City, State 12345",
        phone: "555-123-4567",
        email: "info@citygeneral.com",
        contactPerson: "Dr. Johnson",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "p2",
        name: "Wellness Clinic",
        type: "clinic",
        address: "456 Health Ave, City, State 12345",
        phone: "555-987-6543",
        email: "appointments@wellnessclinic.com",
        contactPerson: "Sarah Smith",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "p3",
        name: "Dr. Martin Physical Therapy",
        type: "physical therapy",
        address: "789 Recovery Rd, City, State 12345",
        phone: "555-789-0123",
        email: "care@martinpt.com",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  },
  getMedicalRecords: async (): Promise<MedicalRecord[]> => {
    // Simulate API call with mock data
    return [
      {
        id: "mr1",
        caseId: "case1",
        clientId: "c1",
        providerId: "p1",
        providerName: "City General Hospital",
        recordType: "visit",
        title: "Initial Consultation",
        description: "Initial evaluation after accident",
        date: new Date().toISOString(),
        amount: 350.00,
        paid: true,
        paidBy: "insurance",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "mr2",
        caseId: "case1",
        clientId: "c1",
        providerId: "p1",
        providerName: "City General Hospital",
        recordType: "test",
        title: "X-Ray Examination",
        description: "X-ray of right shoulder and arm",
        date: new Date().toISOString(),
        amount: 275.50,
        paid: true,
        paidBy: "insurance",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "mr3",
        caseId: "case2",
        clientId: "c2",
        providerId: "p2",
        providerName: "Wellness Clinic",
        recordType: "visit",
        title: "Follow-up Visit",
        description: "Follow-up examination after treatment",
        date: new Date().toISOString(),
        amount: 175.00,
        paid: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "mr4",
        caseId: "case3",
        clientId: "c3",
        providerId: "p3",
        providerName: "Dr. Martin Physical Therapy",
        recordType: "treatment",
        title: "Physical Therapy Session 1",
        description: "Initial physical therapy session",
        date: new Date().toISOString(),
        amount: 120.00,
        paid: true,
        paidBy: "client",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
};

// Export the API for components to use directly
export { medicalApi };

interface MedicalContextType {
  providers: Provider[];
  medicalRecords: MedicalRecord[];
  loading: boolean;
  error: string | null;
  refreshMedicalData: () => Promise<void>;
}

const MedicalContext = createContext<MedicalContextType | undefined>(undefined);

export const useMedical = () => {
  const context = useContext(MedicalContext);
  if (!context) {
    throw new Error('useMedical must be used within a MedicalProvider');
  }
  return context;
};

export const MedicalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const refreshMedicalData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [providersData, recordsData] = await Promise.all([
        medicalApi.getProviders(),
        medicalApi.getMedicalRecords()
      ]);
      
      setProviders(providersData);
      setMedicalRecords(recordsData);
    } catch (error) {
      console.error('Failed to fetch medical data:', error);
      setError('Failed to load medical data. Please try again.');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not load medical data. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMedicalData();
  }, []);

  return (
    <MedicalContext.Provider
      value={{
        providers,
        medicalRecords,
        loading,
        error,
        refreshMedicalData,
      }}
    >
      {children}
    </MedicalContext.Provider>
  );
};
