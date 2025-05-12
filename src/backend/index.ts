// Backend API entry point
import { messagingApi } from './messaging-api';
import { adminApi } from './admin-api';
import { billingApi } from './billing-api';
import { settingsApi } from './settings-api';
import { medicalApi } from './medical-api';
import { depositionsApi } from '../lib/api/depositions-api';
import { attorneysApi } from '../lib/api/attorneys-api';
import { chatbotApi } from './chatbot-api';
import { clientsApi, Appointment, Document, Communication } from '../lib/api/client-api';
import { Patient } from './patients-api';
import { Client } from '@/types/client';

// Create a compatibility layer so that existing patient components can work with clientsApi
export const patientsApi = {
  // Map client methods to patient methods with type conversion
  getPatients: async (): Promise<Patient[]> => {
    const clients = await clientsApi.getClients();
    // Convert Client objects to Patient objects
    return clients.map(client => convertClientToPatient(client));
  },
  
  getPatient: async (id: string): Promise<Patient | null> => {
    const client = await clientsApi.getClient(id);
    if (!client) return null;
    // Convert Client object to Patient object
    return convertClientToPatient(client);
  },
  
  createPatient: async (patientData: Omit<Patient, 'id' | 'accountNumber' | 'dateRegistered'>): Promise<Patient> => {
    // Create a proper client data object with required fields
    const clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> = {
      fullName: patientData.fullName,
      email: patientData.email,
      phone: patientData.phone,
      // Include other fields
      address: patientData.address,
      // Client type doesn't have these fields directly, but they'll be stored as extended properties
      companyName: patientData.companyName || ''
    };
    
    const newClient = await clientsApi.createClient(clientData);
    return convertClientToPatient(newClient as Client);
  },
  
  updatePatient: async (id: string, patientData: Partial<Patient>): Promise<Patient | null> => {
    // We need to ensure we're not passing any Patient-specific fields that don't exist in Client
    const clientData: Partial<Client> = { ...patientData };
    // Delete any patientId properties if they exist to avoid confusion
    if ('patientId' in clientData) delete clientData['patientId'];
    
    const updatedClient = await clientsApi.updateClient(id, clientData);
    if (!updatedClient) return null;
    return convertClientToPatient(updatedClient);
  },
  
  deletePatient: async (id: string): Promise<boolean> => {
    return await clientsApi.deleteClient(id);
  },
  
  getAppointments: async (patientId: string): Promise<Appointment[]> => {
    const appointments = await clientsApi.getAppointments(patientId);
    // Convert client appointments to patient appointments
    return appointments.map(appointment => ({
      ...appointment,
      patientId: appointment.clientId
    }) as unknown as Appointment);
  },
  
  getAppointmentsByStatus: async (patientId: string, status: string): Promise<Appointment[]> => {
    const appointments = await clientsApi.getAppointmentsByStatus(patientId, status);
    return appointments.map(appointment => ({
      ...appointment,
      patientId: appointment.clientId
    }) as unknown as Appointment);
  },
  
  getDocuments: async (patientId: string): Promise<Document[]> => {
    const documents = await clientsApi.getDocuments(patientId);
    return documents.map(document => ({
      ...document,
      patientId: document.clientId
    }) as unknown as Document);
  },
  
  getDocumentsByType: async (patientId: string, type: string): Promise<Document[]> => {
    const documents = await clientsApi.getDocumentsByType(patientId, type);
    return documents.map(document => ({
      ...document,
      patientId: document.clientId
    }) as unknown as Document);
  },
  
  getCommunications: async (patientId: string): Promise<Communication[]> => {
    const communications = await clientsApi.getCommunications(patientId);
    return communications.map(communication => ({
      ...communication,
      patientId: communication.clientId
    }) as unknown as Communication);
  },
  
  markCommunicationAsRead: async (communicationId: string): Promise<Communication | null> => {
    const communication = await clientsApi.markCommunicationAsRead(communicationId);
    if (!communication) return null;
    return {
      ...communication,
      patientId: communication.clientId
    } as unknown as Communication;
  },
  
  getMissedAppointmentsCount: clientsApi.getMissedAppointmentsCount,
  
  getUpcomingAppointment: async (patientId: string) => {
    const appointment = await clientsApi.getUpcomingAppointment(patientId);
    if (!appointment) return null;
    return {
      ...appointment,
      patientId: appointment.clientId
    } as unknown as Appointment;
  },
  
  getLastDocumentUploaded: async (patientId: string) => {
    const document = await clientsApi.getLastDocumentUploaded(patientId);
    if (!document) return null;
    return {
      ...document,
      patientId: document.clientId
    } as unknown as Document;
  },
  
  getSmartNotifications: clientsApi.getSmartNotifications
};

// Helper function to convert Client object to Patient object
function convertClientToPatient(client: Client): Patient {
  return {
    id: client.id,
    accountNumber: client.accountNumber || `A${client.id.substring(0, 3)}`,
    fullName: client.fullName,
    dateOfBirth: client.dateOfBirth || "Not provided",
    phone: client.phone,
    email: client.email,
    address: client.address || "Not provided",
    profilePhoto: client.profilePhoto || "",
    dateRegistered: client.dateRegistered || client.createdAt?.split('T')[0] || "Not provided",
    caseStatus: client.caseStatus || "Initial Consultation",
    assignedAttorneyId: client.assignedAttorneyId || "",
    accidentDate: client.accidentDate || "",
    accidentLocation: client.accidentLocation || "",
    injuryType: client.injuryType || "",
    caseDescription: client.caseDescription || "",
    insuranceCompany: client.insuranceCompany || "",
    insurancePolicyNumber: client.insurancePolicyNumber || "",
    insuranceAdjusterName: client.insuranceAdjusterName || "",
    companyName: client.companyName || ""
  } as Patient;
}

// Helper function to convert Patient object to Client object
function convertPatientToClient(patient: Partial<Patient>): Partial<Client> {
  const clientData: Partial<Client> = {
    ...patient,
    // Map any fields that need special handling
  };
  
  // Remove patient-specific fields that don't exist in Client
  return clientData;
}

// Export all backend APIs
export {
  messagingApi,
  adminApi,
  billingApi,
  settingsApi,
  medicalApi,
  clientsApi,
  depositionsApi,
  attorneysApi,
  chatbotApi
};
