import { v4 as uuidv4 } from 'uuid';

// Patient types
export interface Patient {
  id: string;
  accountNumber: string;
  fullName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  profilePhoto?: string;
  dateRegistered: string;
  caseStatus: 'Active Treatment' | 'Initial Consultation' | 'Case Review' | 'Settlement Negotiation' | 'Closed';
  assignedAttorneyId: string;
  accidentDate?: string;
  accidentLocation?: string;
  injuryType?: string;
  caseDescription?: string;
  insuranceCompany?: string;
  insurancePolicyNumber?: string;
  insuranceAdjusterName?: string;
  companyName?: string; // Added this property
}

export interface Appointment {
  id: string;
  patientId: string;
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
  patientId: string;
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
  patientId: string;
  date: string;
  time: string;
  type: 'email' | 'sms' | 'phone';
  sender: string;
  subject: string;
  content: string;
  read: boolean;
  actionRequired: boolean;
}

// Mock data
const mockPatients: Patient[] = [
  {
    id: 'patient1',
    accountNumber: 'A001',
    fullName: 'John Doe',
    dateOfBirth: '1985-05-15',
    phone: '555-0123',
    email: 'john@example.com',
    address: '123 Main St, Anytown, CA 12345',
    dateRegistered: '2025-04-01',
    caseStatus: 'Active Treatment',
    assignedAttorneyId: 'user2', // Jane Smith attorney ID
    accidentDate: '2025-03-25',
    accidentLocation: 'Intersection of 5th Ave and Main St',
    injuryType: 'Back and Neck Injury',
    caseDescription: 'Client was involved in a rear-end collision causing back and neck injuries requiring physical therapy.',
    insuranceCompany: 'ABC Insurance',
    insurancePolicyNumber: 'ABC123456',
    insuranceAdjusterName: 'Michael Thompson',
    companyName: 'ABC Insurance'
  }
];

const mockAppointments: Appointment[] = [
  {
    id: 'apt1',
    patientId: 'patient1',
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
    patientId: 'patient1',
    doctorFacilityName: 'Dr. Michael Johnson',
    visitDate: '2025-04-25',
    visitTime: '2:00 PM',
    visitStatus: 'scheduled',
    treatmentDescription: 'Physical Therapy Session',
    location: 'PT Associates',
    type: 'Physical Therapy'
  },
  {
    id: 'apt3',
    patientId: 'patient1',
    doctorFacilityName: 'Dr. Michael Johnson',
    visitDate: '2025-04-18',
    visitTime: '3:30 PM',
    visitStatus: 'completed',
    treatmentDescription: 'Physical Therapy Session',
    location: 'PT Associates',
    type: 'Physical Therapy'
  },
  {
    id: 'apt4',
    patientId: 'patient1',
    doctorFacilityName: 'Dr. Michael Johnson',
    visitDate: '2025-04-15',
    visitTime: '3:30 PM',
    visitStatus: 'missed',
    treatmentDescription: 'Physical Therapy Session',
    location: 'PT Associates',
    type: 'Physical Therapy'
  },
  {
    id: 'apt5',
    patientId: 'patient1',
    doctorFacilityName: 'Dr. Michael Johnson',
    visitDate: '2025-04-10',
    visitTime: '1:00 PM',
    visitStatus: 'completed',
    treatmentDescription: 'Physical Therapy Evaluation',
    location: 'PT Associates',
    type: 'Physical Therapy'
  },
  {
    id: 'apt6',
    patientId: 'patient1',
    doctorFacilityName: 'Dr. Sarah Smith',
    visitDate: '2025-04-07',
    visitTime: '11:00 AM',
    visitStatus: 'completed',
    treatmentDescription: 'X-Ray Review',
    location: 'City Medical Center',
    type: 'Radiology'
  },
  {
    id: 'apt7',
    patientId: 'patient1',
    doctorFacilityName: 'Dr. Sarah Smith',
    visitDate: '2025-04-05',
    visitTime: '9:00 AM',
    visitStatus: 'completed',
    treatmentDescription: 'Initial Evaluation',
    location: 'City Medical Center',
    type: 'Consultation'
  }
];

const mockDocuments: Document[] = [
  {
    id: 'doc1',
    patientId: 'patient1',
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
    patientId: 'patient1',
    name: 'X-Ray Report',
    type: 'medical',
    category: 'Medical Reports',
    uploadDate: '2025-04-07',
    fileType: 'pdf',
    url: '/documents/xray-report.pdf',
    uploadedBy: 'City Medical Center'
  },
  {
    id: 'doc3',
    patientId: 'patient1',
    name: 'Physical Therapy Plan',
    type: 'medical',
    category: 'Medical Reports',
    uploadDate: '2025-04-10',
    fileType: 'pdf',
    url: '/documents/pt-plan.pdf',
    uploadedBy: 'PT Associates'
  },
  {
    id: 'doc4',
    patientId: 'patient1',
    name: 'Letter of Protection',
    type: 'legal',
    category: 'Legal Documents',
    uploadDate: '2025-04-06',
    fileType: 'pdf',
    url: '/documents/lop.pdf',
    uploadedBy: 'Jane Doelawyer'
  },
  {
    id: 'doc5',
    patientId: 'patient1',
    name: 'Letter of Representation',
    type: 'legal',
    category: 'Legal Documents',
    uploadDate: '2025-04-04',
    fileType: 'pdf',
    url: '/documents/lor.pdf',
    uploadedBy: 'Jane Doelawyer'
  },
  {
    id: 'doc6',
    patientId: 'patient1',
    name: 'Accident Report',
    type: 'misc',
    category: 'Police Reports',
    uploadDate: '2025-04-01',
    fileType: 'pdf',
    url: '/documents/accident-report.pdf',
    uploadedBy: 'Police Department'
  },
  {
    id: 'doc7',
    patientId: 'patient1',
    name: 'Hospital Bill',
    type: 'billing',
    category: 'Bills & Receipts',
    uploadDate: '2025-04-10',
    fileType: 'pdf',
    url: '/documents/hospital-bill.pdf',
    uploadedBy: 'City Hospital'
  },
  {
    id: 'doc8',
    patientId: 'patient1',
    name: 'Medication Receipt',
    type: 'billing',
    category: 'Bills & Receipts',
    uploadDate: '2025-04-12',
    fileType: 'image',
    url: '/documents/receipt.jpg',
    uploadedBy: 'Patient'
  }
];

const mockCommunications: Communication[] = [
  {
    id: 'comm1',
    patientId: 'patient1',
    date: '2025-04-20',
    time: '10:15 AM',
    type: 'email',
    sender: 'Jane Doelawyer',
    subject: 'Case Update - Treatment Progress',
    content: 'Your case is progressing as expected. We have submitted your initial medical records to the insurance company and are awaiting their response. You are currently in the "Active Treatment" phase, where it\'s important that you continue to attend all scheduled medical appointments and follow your treatment plan.\n\nPlease be aware that you missed your physical therapy appointment on April 15. It\'s crucial for your case that you maintain consistent treatment. I\'ve instructed my assistant to contact you to reschedule this appointment.\n\nOur next step will be to collect additional medical documentation once your current treatment phase is complete. We anticipate this will be in approximately 4-6 weeks, depending on your recovery progress.\n\nBest regards,\nJane Doelawyer\nPersonal Injury Attorney\nLYZ Law Firm',
    read: true,
    actionRequired: false
  },
  {
    id: 'comm2',
    patientId: 'patient1',
    date: '2025-04-18',
    time: '2:45 PM',
    type: 'phone',
    sender: 'Jane Doelawyer',
    subject: 'Missed Appointment Follow-up',
    content: 'Call to discuss the missed physical therapy appointment and importance of consistent treatment.',
    read: true,
    actionRequired: true
  },
  {
    id: 'comm3',
    patientId: 'patient1',
    date: '2025-04-15',
    time: '4:30 PM',
    type: 'sms',
    sender: 'LYZ Law Firm',
    subject: 'Appointment Reminder',
    content: 'Reminder: You have a physical therapy appointment tomorrow at 3:30 PM with Dr. Johnson at PT Associates.',
    read: true,
    actionRequired: false
  },
  {
    id: 'comm4',
    patientId: 'patient1',
    date: '2025-04-12',
    time: '11:20 AM',
    type: 'email',
    sender: 'Jane Doelawyer',
    subject: 'Insurance Claim Update',
    content: 'I wanted to inform you that we\'ve received confirmation that ABC Insurance has acknowledged your claim...',
    read: true,
    actionRequired: false
  },
  {
    id: 'comm5',
    patientId: 'patient1',
    date: '2025-04-10',
    time: '9:05 AM',
    type: 'email',
    sender: 'Documents Portal',
    subject: 'New Document Available',
    content: 'A new document \'Letter of Protection\' has been uploaded to your document center...',
    read: false,
    actionRequired: true
  }
];

// API functions
export const patientsApi = {
  // Patient management
  getPatients: async (): Promise<Patient[]> => {
    return mockPatients;
  },

  getPatient: async (id: string): Promise<Patient | null> => {
    const patient = mockPatients.find(p => p.id === id);
    return patient || null;
  },

  createPatient: async (patientData: Omit<Patient, 'id' | 'accountNumber' | 'dateRegistered'>): Promise<Patient> => {
    // Generate the next account number
    const lastNumber = mockPatients.length > 0 
      ? parseInt(mockPatients[mockPatients.length - 1].accountNumber.substring(1)) 
      : 0;
    
    const nextNumber = lastNumber + 1;
    const accountNumber = `A${nextNumber.toString().padStart(3, '0')}`;

    const newPatient: Patient = {
      ...patientData,
      id: uuidv4(),
      accountNumber,
      dateRegistered: new Date().toISOString().split('T')[0]
    };

    mockPatients.push(newPatient);
    return newPatient;
  },

  updatePatient: async (id: string, patientData: Partial<Patient>): Promise<Patient | null> => {
    const index = mockPatients.findIndex(p => p.id === id);
    if (index !== -1) {
      mockPatients[index] = { ...mockPatients[index], ...patientData };
      return mockPatients[index];
    }
    return null;
  },

  deletePatient: async (id: string): Promise<boolean> => {
    const index = mockPatients.findIndex(p => p.id === id);
    if (index !== -1) {
      mockPatients.splice(index, 1);
      return true;
    }
    return false;
  },

  // Appointments
  getAppointments: async (patientId: string): Promise<Appointment[]> => {
    return mockAppointments.filter(apt => apt.patientId === patientId);
  },

  getAppointmentsByStatus: async (patientId: string, status: string): Promise<Appointment[]> => {
    return mockAppointments.filter(apt => apt.patientId === patientId && apt.visitStatus === status);
  },

  // Documents
  getDocuments: async (patientId: string): Promise<Document[]> => {
    return mockDocuments.filter(doc => doc.patientId === patientId);
  },

  getDocumentsByType: async (patientId: string, type: string): Promise<Document[]> => {
    return mockDocuments.filter(doc => doc.patientId === patientId && doc.type === type);
  },

  // Communications
  getCommunications: async (patientId: string): Promise<Communication[]> => {
    return mockCommunications.filter(comm => comm.patientId === patientId);
  },

  markCommunicationAsRead: async (communicationId: string): Promise<Communication | null> => {
    const index = mockCommunications.findIndex(comm => comm.id === communicationId);
    if (index !== -1) {
      mockCommunications[index].read = true;
      return mockCommunications[index];
    }
    return null;
  },

  // Smart functions
  getMissedAppointmentsCount: async (patientId: string): Promise<number> => {
    return mockAppointments.filter(apt => apt.patientId === patientId && apt.visitStatus === 'missed').length;
  },

  getUpcomingAppointment: async (patientId: string): Promise<Appointment | null> => {
    const upcomingAppointments = mockAppointments
      .filter(apt => apt.patientId === patientId && apt.visitStatus === 'scheduled')
      .sort((a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime());
    
    return upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;
  },

  getLastDocumentUploaded: async (patientId: string): Promise<Document | null> => {
    const documents = mockDocuments
      .filter(doc => doc.patientId === patientId)
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    
    return documents.length > 0 ? documents[0] : null;
  },

  getSmartNotifications: async (patientId: string): Promise<string[]> => {
    const notifications: string[] = [];
    
    // Check for missed appointments
    const missedCount = await patientsApi.getMissedAppointmentsCount(patientId);
    if (missedCount > 0) {
      notifications.push(`You have missed ${missedCount} appointment(s). Please contact your provider to reschedule.`);
    }
    
    // Check for upcoming appointments
    const upcomingAppointment = await patientsApi.getUpcomingAppointment(patientId);
    if (upcomingAppointment) {
      const appointmentDate = new Date(upcomingAppointment.visitDate);
      const today = new Date();
      const daysUntil = Math.ceil((appointmentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntil <= 7) {
        notifications.push(`Your next appointment is in ${daysUntil} day(s) on ${upcomingAppointment.visitDate} at ${upcomingAppointment.visitTime}.`);
      }
    }
    
    // Check for treatment gaps
    const appointments = await patientsApi.getAppointments(patientId);
    if (appointments.length > 0) {
      const lastAppointment = appointments
        .filter(apt => apt.visitStatus === 'completed')
        .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())[0];
      
      if (lastAppointment) {
        const lastDate = new Date(lastAppointment.visitDate);
        const today = new Date();
        const daysSince = Math.ceil((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSince > 14) {
          notifications.push(`It's been ${daysSince} days since your last treatment. Please follow up with your provider.`);
        }
      }
    }
    
    return notifications;
  }
};
