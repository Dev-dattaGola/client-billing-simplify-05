import axios from 'axios';
import { Client } from '@/types/client';
import { v4 as uuidv4 } from 'uuid';

// Define API base URL from environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Define additional types from client model
export interface Appointment {
  id: string;
  clientId: string;
  doctorFacilityName: string;
  visitDate: string;
  visitTime: string;
  visitStatus: 'completed' | 'missed' | 'scheduled';
  treatmentDescription?: string;
  location: string;
  type: string;
}

export interface Document {
  id: string;
  clientId: string;
  name: string;
  type: 'medical' | 'legal' | 'billing' | 'misc';
  category: string;
  uploadDate: string;
  fileType: string;
  url: string;
  uploadedBy: string;
}

export interface Communication {
  id: string;
  clientId: string;
  date: string;
  time: string;
  type: 'email' | 'sms' | 'phone';
  sender: string;
  subject: string;
  content: string;
  read: boolean;
  actionRequired: boolean;
}

// Mock clients data for fallback
const mockClients: Client[] = [
  {
    id: 'client1',
    accountNumber: 'A001',
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '555-0123',
    address: '123 Main St, Anytown, CA 12345',
    companyName: 'Acme Inc.',
    tags: ['Personal Injury', 'Active'],
    notes: 'Client involved in a car accident on March 25, 2025',
    createdAt: '2025-04-01T10:00:00Z',
    updatedAt: '2025-04-20T15:30:00Z',
    dateOfBirth: '1985-05-15',
    profilePhoto: 'https://i.pravatar.cc/150?img=1',
    caseStatus: 'Active Treatment',
    assignedAttorneyId: 'attorney1',
    accidentDate: '2025-03-25',
    accidentLocation: 'Intersection of 5th Ave and Main St',
    injuryType: 'Back and Neck Injury',
    caseDescription: 'Client was involved in a rear-end collision causing back and neck injuries requiring physical therapy.',
    insuranceCompany: 'ABC Insurance',
    insurancePolicyNumber: 'ABC123456',
    insuranceAdjusterName: 'Michael Thompson',
    dateRegistered: '2025-04-01'
  },
  {
    id: 'client2',
    accountNumber: 'A002',
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-0124',
    address: '456 Oak St, Sometown, CA 12346',
    companyName: 'Smith Co.',
    tags: ['Medical Malpractice', 'Review'],
    notes: 'Client seeking representation for medical malpractice case',
    createdAt: '2025-04-05T09:15:00Z',
    updatedAt: '2025-04-18T11:45:00Z',
    dateOfBirth: '1970-08-22',
    profilePhoto: 'https://i.pravatar.cc/150?img=2',
    caseStatus: 'Initial Consultation',
    assignedAttorneyId: 'attorney2',
    dateRegistered: '2025-04-05'
  },
  {
    id: 'client3',
    accountNumber: 'A003',
    fullName: 'Robert Johnson',
    email: 'robert@example.com',
    phone: '555-0125',
    address: '789 Pine St, Othertown, CA 12347',
    companyName: 'Johnson Enterprises',
    tags: ['Slip and Fall', 'Active', 'Priority'],
    notes: 'Client slipped and fell at local grocery store',
    createdAt: '2025-04-10T14:20:00Z',
    updatedAt: '2025-04-22T10:10:00Z',
    dateOfBirth: '1992-03-17',
    profilePhoto: 'https://i.pravatar.cc/150?img=3',
    caseStatus: 'Settlement Negotiation',
    assignedAttorneyId: 'attorney1',
    accidentDate: '2025-04-02',
    accidentLocation: 'Fresh Foods Grocery Store',
    injuryType: 'Broken Wrist, Hip Injury',
    insuranceCompany: 'XYZ Insurance',
    insurancePolicyNumber: 'XYZ789012',
    dateRegistered: '2025-04-10'
  }
];

// Mock data for client-related information for fallback
const mockAppointments: Appointment[] = [
  {
    id: 'apt1',
    clientId: 'client1',
    doctorFacilityName: 'Dr. Michael Johnson',
    visitDate: '2025-05-10',
    visitTime: '10:30 AM',
    visitStatus: 'scheduled',
    treatmentDescription: 'Follow-up consultation',
    location: 'PT Associates',
    type: 'Physical Therapy'
  },
  {
    id: 'apt2',
    clientId: 'client1',
    doctorFacilityName: 'Dr. Sarah White',
    visitDate: '2025-04-15',
    visitTime: '3:30 PM',
    visitStatus: 'missed',
    treatmentDescription: 'MRI Scan',
    location: 'City Medical Center',
    type: 'Diagnostic'
  },
  {
    id: 'apt3',
    clientId: 'client2',
    doctorFacilityName: 'Dr. James Wilson',
    visitDate: '2025-05-05',
    visitTime: '2:00 PM',
    visitStatus: 'scheduled',
    treatmentDescription: 'Initial Evaluation',
    location: 'Wilson Medical Practice',
    type: 'Consultation'
  }
];

const mockDocuments: Document[] = [
  {
    id: 'doc1',
    clientId: 'client1',
    name: 'Initial Medical Evaluation',
    type: 'medical',
    category: 'Medical Reports',
    uploadDate: '2025-04-05',
    fileType: 'pdf',
    url: '/documents/initial-evaluation.pdf',
    uploadedBy: 'Dr. Smith'
  },
  {
    id: 'doc2',
    clientId: 'client1',
    name: 'Police Report',
    type: 'legal',
    category: 'Accident Reports',
    uploadDate: '2025-04-02',
    fileType: 'pdf',
    url: '/documents/police-report.pdf',
    uploadedBy: 'Jane Doelawyer'
  },
  {
    id: 'doc3',
    clientId: 'client2',
    name: 'Medical Records Release Form',
    type: 'legal',
    category: 'Forms',
    uploadDate: '2025-04-06',
    fileType: 'pdf',
    url: '/documents/release-form.pdf',
    uploadedBy: 'Jane Smith'
  }
];

const mockCommunications: Communication[] = [
  {
    id: 'comm1',
    clientId: 'client1',
    date: '2025-04-20',
    time: '10:15 AM',
    type: 'email',
    sender: 'Jane Doelawyer',
    subject: 'Case Update - Treatment Progress',
    content: 'Your case is progressing as expected. We have submitted your initial medical records...',
    read: true,
    actionRequired: false
  },
  {
    id: 'comm2',
    clientId: 'client1',
    date: '2025-04-15',
    time: '3:30 PM',
    type: 'sms',
    sender: 'LYZ Law Firm',
    subject: 'Appointment Reminder',
    content: 'Reminder: You have an MRI appointment tomorrow at 3:30 PM at City Medical Center.',
    read: true,
    actionRequired: false
  },
  {
    id: 'comm3',
    clientId: 'client2',
    date: '2025-04-18',
    time: '9:45 AM',
    type: 'email',
    sender: 'Jane Doelawyer',
    subject: 'Initial Consultation Follow-up',
    content: 'Thank you for meeting with us yesterday. As discussed, we need additional medical records...',
    read: false,
    actionRequired: true
  }
];

// API service with both real API calls and fallback to mock data
export const clientsApi = {
  // Client methods
  getClients: async (): Promise<Client[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients`);
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      console.warn('Falling back to mock data');
      return mockClients;
    }
  },

  getClient: async (id: string): Promise<Client | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching client:', error);
      console.warn('Falling back to mock data');
      const client = mockClients.find(c => c.id === id);
      return client || null;
    }
  },

  createClient: async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client | null> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/clients`, clientData);
      return response.data;
    } catch (error) {
      console.error('Error creating client:', error);
      console.warn('Falling back to mock data');
      
      // For mock data fallback
      const newClient: Client = {
        ...clientData,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockClients.push(newClient);
      return newClient;
    }
  },

  updateClient: async (id: string, clientData: Partial<Client>): Promise<Client | null> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/clients/${id}`, clientData);
      return response.data;
    } catch (error) {
      console.error('Error updating client:', error);
      console.warn('Falling back to mock data');
      
      // For mock data fallback
      const index = mockClients.findIndex(c => c.id === id);
      if (index === -1) return null;
      
      mockClients[index] = {
        ...mockClients[index],
        ...clientData,
        updatedAt: new Date().toISOString()
      };
      
      return mockClients[index];
    }
  },

  deleteClient: async (id: string): Promise<boolean> => {
    try {
      await axios.delete(`${API_BASE_URL}/clients/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      console.warn('Falling back to mock data');
      
      // For mock data fallback
      const index = mockClients.findIndex(c => c.id === id);
      if (index === -1) return false;
      
      mockClients.splice(index, 1);
      return true;
    }
  },

  // Additional client-related methods
  getAppointments: async (clientId: string): Promise<Appointment[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients/${clientId}/appointments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      console.warn('Falling back to mock data');
      return mockAppointments.filter(apt => apt.clientId === clientId);
    }
  },

  getDocuments: async (clientId: string): Promise<Document[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients/${clientId}/documents`);
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      console.warn('Falling back to mock data');
      return mockDocuments.filter(doc => doc.clientId === clientId);
    }
  },

  getCommunications: async (clientId: string): Promise<Communication[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients/${clientId}/communications`);
      return response.data;
    } catch (error) {
      console.error('Error fetching communications:', error);
      console.warn('Falling back to mock data');
      return mockCommunications.filter(comm => comm.clientId === clientId);
    }
  },

  // Utility functions
  getAppointmentsByStatus: async (clientId: string, status: string): Promise<Appointment[]> => {
    const appointments = await clientsApi.getAppointments(clientId);
    return appointments.filter(apt => apt.visitStatus === status);
  },

  getDocumentsByType: async (clientId: string, type: string): Promise<Document[]> => {
    const documents = await clientsApi.getDocuments(clientId);
    return documents.filter(doc => doc.type === type);
  },

  markCommunicationAsRead: async (communicationId: string): Promise<Communication | null> => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/communications/${communicationId}`, { read: true });
      return response.data;
    } catch (error) {
      console.error('Error marking communication as read:', error);
      console.warn('Falling back to mock data');
      
      // For mock data fallback
      const index = mockCommunications.findIndex(comm => comm.id === communicationId);
      if (index !== -1) {
        mockCommunications[index].read = true;
        return mockCommunications[index];
      }
      return null;
    }
  },

  getMissedAppointmentsCount: async (clientId: string): Promise<number> => {
    const appointments = await clientsApi.getAppointmentsByStatus(clientId, 'missed');
    return appointments.length;
  },

  getUpcomingAppointment: async (clientId: string): Promise<Appointment | null> => {
    const upcomingAppointments = await clientsApi.getAppointmentsByStatus(clientId, 'scheduled');
    return upcomingAppointments.length > 0 
      ? upcomingAppointments.sort((a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime())[0] 
      : null;
  },

  getLastDocumentUploaded: async (clientId: string): Promise<Document | null> => {
    const documents = await clientsApi.getDocuments(clientId);
    return documents.length > 0 
      ? documents.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())[0]
      : null;
  },

  getSmartNotifications: async (clientId: string): Promise<string[]> => {
    const notifications: string[] = [];
    
    // Check for missed appointments
    const missedCount = await clientsApi.getMissedAppointmentsCount(clientId);
    if (missedCount > 0) {
      notifications.push(`Client has missed ${missedCount} appointment(s). Please contact to reschedule.`);
    }
    
    // Check for upcoming appointments
    const upcomingAppointment = await clientsApi.getUpcomingAppointment(clientId);
    if (upcomingAppointment) {
      const appointmentDate = new Date(upcomingAppointment.visitDate);
      const today = new Date();
      const daysUntil = Math.ceil((appointmentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntil <= 7) {
        notifications.push(`Next appointment is in ${daysUntil} day(s) on ${upcomingAppointment.visitDate} at ${upcomingAppointment.visitTime}.`);
      }
    }
    
    return notifications;
  }
};
