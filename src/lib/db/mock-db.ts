import { Client } from '@/types/client';
import { Case, CaseTimelineEvent } from '@/types/case';
import { MedicalRecord, Provider } from '@/types/medical';

// Try to load clients from localStorage
const getSavedClients = (): Client[] => {
  try {
    const savedClientsJson = localStorage.getItem('mockClients');
    if (savedClientsJson) {
      return JSON.parse(savedClientsJson);
    }
  } catch (error) {
    console.error('Error loading clients from localStorage:', error);
  }
  
  // Default mock data if nothing in localStorage
  return [
    {
      id: '1',
      name: 'John Doe',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      companyName: 'Acme Inc.',
      address: '123 Main St, Anytown, USA',
      tags: ['personal injury', 'active'],
      notes: 'Returning client',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-03-20T15:45:00Z',
      status: 'active',
      assignedAttorney: 'Jane Doe',
      caseType: 'Personal Injury',
      caseStatus: 'Active',
    },
    {
      id: '2',
      name: 'Jane Smith',
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '(555) 987-6543',
      companyName: 'Smith LLC',
      tags: ['corporate', 'new'],
      createdAt: '2024-02-22T09:15:00Z',
      updatedAt: '2024-02-22T09:15:00Z',
      status: 'active',
      assignedAttorney: 'Bob Johnson',
      caseType: 'Corporate Law',
      caseStatus: 'Initial Consultation',
    },
    {
      id: '3',
      name: 'Robert Johnson',
      fullName: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      phone: '(555) 456-7890',
      tags: ['personal injury', 'pending'],
      notes: 'Referred by Jane Smith',
      createdAt: '2024-03-10T14:20:00Z',
      updatedAt: '2024-04-05T11:30:00Z',
      status: 'active',
      assignedAttorney: 'Jane Doe',
      caseType: 'Personal Injury',
      caseStatus: 'Pending',
    },
  ];
};

// Try to load cases from localStorage
const getSavedCases = (): Case[] => {
  try {
    const savedCasesJson = localStorage.getItem('mockCases');
    if (savedCasesJson) {
      return JSON.parse(savedCasesJson);
    }
  } catch (error) {
    console.error('Error loading cases from localStorage:', error);
  }
  
  // Default mock data if nothing in localStorage
  return [
    {
      id: '1',
      title: 'Slip and Fall Claim',
      caseNumber: 'PI-2024-001',
      clientId: '1',
      caseType: 'slip and fall',
      status: 'open',
      description: 'Client slipped on wet floor at grocery store',
      assignedTo: ['attorney1', 'paralegal1'],
      openDate: '2024-01-20T10:30:00Z',
      statueOfLimitations: '2026-01-20T10:30:00Z',
      notes: 'High priority case with good evidence',
      createdAt: '2024-01-20T10:30:00Z',
      updatedAt: '2024-03-15T14:22:00Z',
    },
    {
      id: '2',
      title: 'Auto Accident Claim',
      caseNumber: 'AA-2024-003',
      clientId: '2',
      caseType: 'auto accident',
      status: 'pending',
      description: 'Rear-end collision at intersection',
      openDate: '2024-02-25T09:15:00Z',
      courtDate: '2024-06-12T09:00:00Z',
      createdAt: '2024-02-25T09:15:00Z',
      updatedAt: '2024-02-25T09:15:00Z',
    },
    {
      id: '3',
      title: 'Medical Malpractice Claim',
      caseNumber: 'MM-2024-002',
      clientId: '3',
      caseType: 'medical malpractice',
      status: 'open',
      description: 'Surgical error during routine procedure',
      assignedTo: ['attorney2'],
      openDate: '2024-03-15T14:20:00Z',
      statueOfLimitations: '2026-03-15T14:20:00Z',
      createdAt: '2024-03-15T14:20:00Z',
      updatedAt: '2024-04-01T11:10:00Z',
    },
  ];
};

// Try to load medical records from localStorage
const getSavedMedicalRecords = (): MedicalRecord[] => {
  try {
    const savedMedicalRecordsJson = localStorage.getItem('mockMedicalRecords');
    if (savedMedicalRecordsJson) {
      return JSON.parse(savedMedicalRecordsJson);
    }
  } catch (error) {
    console.error('Error loading medical records from localStorage:', error);
  }
  
  // Default mock data if nothing in localStorage
  return [
    {
      id: '1',
      caseId: '1',
      clientId: '1',
      providerId: '1',
      providerName: 'General Hospital',
      recordType: 'visit',
      title: 'Initial ER Visit',
      description: 'Emergency room visit after fall',
      date: '2024-01-15T11:30:00Z',
      amount: 2500,
      paid: false,
      notes: 'X-rays and CT scan performed',
      createdAt: '2024-01-16T09:30:00Z',
      updatedAt: '2024-01-16T09:30:00Z',
    },
    {
      id: '2',
      caseId: '1',
      clientId: '1',
      providerId: '2',
      providerName: 'City Physical Therapy',
      recordType: 'treatment',
      title: 'Physical Therapy Session 1',
      description: 'Initial assessment and therapy',
      date: '2024-01-22T14:00:00Z',
      amount: 150,
      paid: true,
      paidBy: 'insurance',
      createdAt: '2024-01-23T10:15:00Z',
      updatedAt: '2024-01-23T10:15:00Z',
    },
    {
      id: '3',
      caseId: '2',
      clientId: '2',
      providerId: '1',
      providerName: 'General Hospital',
      recordType: 'visit',
      title: 'Initial Assessment',
      description: 'Evaluation after auto accident',
      date: '2024-02-25T10:30:00Z',
      amount: 1800,
      paid: false,
      createdAt: '2024-02-26T09:45:00Z',
      updatedAt: '2024-02-26T09:45:00Z',
    },
  ];
};

// Initialize from localStorage or defaults
let mockClients = getSavedClients();
let mockCases = getSavedCases();
let mockMedicalRecords = getSavedMedicalRecords();

// Save data to localStorage
const saveClients = () => {
  try {
    localStorage.setItem('mockClients', JSON.stringify(mockClients));
  } catch (error) {
    console.error('Error saving clients to localStorage:', error);
  }
};

const saveCases = () => {
  try {
    localStorage.setItem('mockCases', JSON.stringify(mockCases));
  } catch (error) {
    console.error('Error saving cases to localStorage:', error);
  }
};

const saveMedicalRecords = () => {
  try {
    localStorage.setItem('mockMedicalRecords', JSON.stringify(mockMedicalRecords));
  } catch (error) {
    console.error('Error saving medical records to localStorage:', error);
  }
};

// Helper functions to simulate delay and API behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate async operations
export const mockDb = {
  clients: {
    getAll: async (): Promise<Client[]> => {
      await delay(300); // Simulate network delay
      return [...mockClients];
    },
    
    getById: async (id: string): Promise<Client | null> => {
      await delay(200);
      return mockClients.find(client => client.id === id) || null;
    },
    
    create: async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> => {
      await delay(300);
      const newClient: Client = {
        id: Math.random().toString(36).substring(2, 11),
        ...clientData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockClients.push(newClient);
      saveClients(); // Save to localStorage
      return newClient;
    },
    
    update: async (id: string, data: Partial<Client>): Promise<Client | null> => {
      await delay(300);
      const index = mockClients.findIndex(client => client.id === id);
      if (index === -1) return null;
      
      mockClients[index] = {
        ...mockClients[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      saveClients(); // Save to localStorage
      return mockClients[index];
    },
    
    delete: async (id: string): Promise<boolean> => {
      await delay(200);
      const initialLength = mockClients.length;
      const index = mockClients.findIndex(client => client.id === id);
      if (index !== -1) {
        mockClients.splice(index, 1);
        saveClients(); // Save to localStorage
      }
      return initialLength > mockClients.length;
    },
  },
  
  cases: {
    getAll: async (): Promise<Case[]> => {
      await delay(300);
      return [...mockCases];
    },
    
    getByClientId: async (clientId: string): Promise<Case[]> => {
      await delay(250);
      return mockCases.filter(c => c.clientId === clientId);
    },
    
    getById: async (id: string): Promise<Case | null> => {
      await delay(200);
      return mockCases.find(c => c.id === id) || null;
    },
    
    create: async (caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>): Promise<Case> => {
      await delay(300);
      const newCase: Case = {
        id: Math.random().toString(36).substring(2, 11),
        ...caseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockCases.push(newCase);
      saveCases();
      return newCase;
    },
    
    update: async (id: string, data: Partial<Case>): Promise<Case | null> => {
      await delay(300);
      const index = mockCases.findIndex(c => c.id === id);
      if (index === -1) return null;
      
      mockCases[index] = {
        ...mockCases[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      saveCases();
      return mockCases[index];
    },
    
    delete: async (id: string): Promise<boolean> => {
      await delay(200);
      const initialLength = mockCases.length;
      const index = mockCases.findIndex(c => c.id === id);
      if (index !== -1) {
        mockCases.splice(index, 1);
        saveCases();
      }
      return initialLength > mockCases.length;
    },
  },
  
  medicalRecords: {
    getAll: async (): Promise<MedicalRecord[]> => {
      await delay(300);
      return [...mockMedicalRecords];
    },
    
    getByCaseId: async (caseId: string): Promise<MedicalRecord[]> => {
      await delay(250);
      return mockMedicalRecords.filter(record => record.caseId === caseId);
    },
    
    getByClientId: async (clientId: string): Promise<MedicalRecord[]> => {
      await delay(250);
      return mockMedicalRecords.filter(record => record.clientId === clientId);
    },
    
    getById: async (id: string): Promise<MedicalRecord | null> => {
      await delay(200);
      return mockMedicalRecords.find(record => record.id === id) || null;
    },
    
    create: async (recordData: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<MedicalRecord> => {
      await delay(300);
      const newRecord: MedicalRecord = {
        id: Math.random().toString(36).substring(2, 11),
        ...recordData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockMedicalRecords.push(newRecord);
      saveMedicalRecords();
      return newRecord;
    },
    
    update: async (id: string, data: Partial<MedicalRecord>): Promise<MedicalRecord | null> => {
      await delay(300);
      const index = mockMedicalRecords.findIndex(record => record.id === id);
      if (index === -1) return null;
      
      mockMedicalRecords[index] = {
        ...mockMedicalRecords[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      saveMedicalRecords();
      return mockMedicalRecords[index];
    },
    
    delete: async (id: string): Promise<boolean> => {
      await delay(200);
      const initialLength = mockMedicalRecords.length;
      const index = mockMedicalRecords.findIndex(record => record.id === id);
      if (index !== -1) {
        mockMedicalRecords.splice(index, 1);
        saveMedicalRecords();
      }
      return initialLength > mockMedicalRecords.length;
    },
  },
};
