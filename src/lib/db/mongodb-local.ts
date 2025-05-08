
import { v4 as uuidv4 } from 'uuid';
import { Client } from '@/types/client';
import { Case } from '@/types/case';
import { MedicalRecord } from '@/types/medical';
import { CalendarEvent, Task } from '@/types/calendar';
import { User } from '@/types/user';
import { Firm } from '@/types/firm';

// This is a mock MongoDB client for local development
// In production, this would be replaced with actual MongoDB calls

export class MongoDBClient {
  private static instance: MongoDBClient;
  private clients: Client[] = [];
  private cases: Case[] = [];
  private medicalRecords: MedicalRecord[] = [];
  private events: CalendarEvent[] = [];
  private tasks: Task[] = [];
  private users: User[] = [];
  private firms: Firm[] = [];
  private isConnected: boolean = false;

  private constructor() {
    // Initialize with some mock data
    this.initMockData();
  }

  public static getInstance(): MongoDBClient {
    if (!MongoDBClient.instance) {
      MongoDBClient.instance = new MongoDBClient();
    }
    return MongoDBClient.instance;
  }

  public async connect(): Promise<void> {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 100));
    this.isConnected = true;
    console.log('MongoDB connected successfully');
    return Promise.resolve();
  }

  public isDbConnected(): boolean {
    return this.isConnected;
  }

  // Client methods
  public async getClients(): Promise<Client[]> {
    return Promise.resolve([...this.clients]);
  }

  public async getClient(id: string): Promise<Client | null> {
    const client = this.clients.find(c => c.id === id);
    return Promise.resolve(client || null);
  }

  public async createClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    const newClient: Client = {
      ...clientData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.clients.push(newClient);
    return Promise.resolve(newClient);
  }

  public async updateClient(id: string, clientData: Partial<Client>): Promise<Client | null> {
    const index = this.clients.findIndex(c => c.id === id);
    if (index === -1) return Promise.resolve(null);

    const updatedClient = {
      ...this.clients[index],
      ...clientData,
      updatedAt: new Date().toISOString()
    };
    this.clients[index] = updatedClient;
    return Promise.resolve(updatedClient);
  }

  public async deleteClient(id: string): Promise<boolean> {
    const initialLength = this.clients.length;
    this.clients = this.clients.filter(c => c.id !== id);
    return Promise.resolve(this.clients.length < initialLength);
  }

  // Case methods
  public async getCases(): Promise<Case[]> {
    return Promise.resolve([...this.cases]);
  }

  public async getCasesByClientId(clientId: string): Promise<Case[]> {
    return Promise.resolve(this.cases.filter(c => c.clientId === clientId));
  }

  public async getCase(id: string): Promise<Case | null> {
    const caseItem = this.cases.find(c => c.id === id);
    return Promise.resolve(caseItem || null);
  }

  public async createCase(caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>): Promise<Case> {
    const newCase: Case = {
      ...caseData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.cases.push(newCase);
    return Promise.resolve(newCase);
  }

  public async updateCase(id: string, caseData: Partial<Case>): Promise<Case | null> {
    const index = this.cases.findIndex(c => c.id === id);
    if (index === -1) return Promise.resolve(null);

    const updatedCase = {
      ...this.cases[index],
      ...caseData,
      updatedAt: new Date().toISOString()
    };
    this.cases[index] = updatedCase;
    return Promise.resolve(updatedCase);
  }

  public async deleteCase(id: string): Promise<boolean> {
    const initialLength = this.cases.length;
    this.cases = this.cases.filter(c => c.id !== id);
    return Promise.resolve(this.cases.length < initialLength);
  }

  // Medical Record methods
  public async getMedicalRecords(): Promise<MedicalRecord[]> {
    return Promise.resolve([...this.medicalRecords]);
  }

  public async getMedicalRecordsByCaseId(caseId: string): Promise<MedicalRecord[]> {
    return Promise.resolve(this.medicalRecords.filter(r => r.caseId === caseId));
  }

  public async getMedicalRecordsByClientId(clientId: string): Promise<MedicalRecord[]> {
    return Promise.resolve(this.medicalRecords.filter(r => r.clientId === clientId));
  }

  public async getMedicalRecord(id: string): Promise<MedicalRecord | null> {
    const record = this.medicalRecords.find(r => r.id === id);
    return Promise.resolve(record || null);
  }

  public async createMedicalRecord(recordData: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<MedicalRecord> {
    const newRecord: MedicalRecord = {
      ...recordData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.medicalRecords.push(newRecord);
    return Promise.resolve(newRecord);
  }

  public async updateMedicalRecord(id: string, recordData: Partial<MedicalRecord>): Promise<MedicalRecord | null> {
    const index = this.medicalRecords.findIndex(r => r.id === id);
    if (index === -1) return Promise.resolve(null);

    const updatedRecord = {
      ...this.medicalRecords[index],
      ...recordData,
      updatedAt: new Date().toISOString()
    };
    this.medicalRecords[index] = updatedRecord;
    return Promise.resolve(updatedRecord);
  }

  public async deleteMedicalRecord(id: string): Promise<boolean> {
    const initialLength = this.medicalRecords.length;
    this.medicalRecords = this.medicalRecords.filter(r => r.id !== id);
    return Promise.resolve(this.medicalRecords.length < initialLength);
  }

  // Calendar Event methods
  public async getEvents(): Promise<CalendarEvent[]> {
    return Promise.resolve([...this.events]);
  }

  public async getEventById(id: string): Promise<CalendarEvent | null> {
    const event = this.events.find(e => e.id === id);
    return Promise.resolve(event || null);
  }

  public async getEventsByUserId(userId: string): Promise<CalendarEvent[]> {
    return Promise.resolve(this.events.filter(e => 
      e.participants?.includes(userId) || e.createdBy === userId
    ));
  }

  public async createEvent(eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<CalendarEvent> {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.events.push(newEvent);
    return Promise.resolve(newEvent);
  }

  public async updateEvent(id: string, eventData: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
    const index = this.events.findIndex(e => e.id === id);
    if (index === -1) return Promise.resolve(null);

    const updatedEvent = {
      ...this.events[index],
      ...eventData,
      updatedAt: new Date()
    };
    this.events[index] = updatedEvent;
    return Promise.resolve(updatedEvent);
  }

  public async deleteEvent(id: string): Promise<boolean> {
    const initialLength = this.events.length;
    this.events = this.events.filter(e => e.id !== id);
    return Promise.resolve(this.events.length < initialLength);
  }

  // Task methods
  public async getTasks(): Promise<Task[]> {
    return Promise.resolve([...this.tasks]);
  }

  public async getTaskById(id: string): Promise<Task | null> {
    const task = this.tasks.find(t => t.id === id);
    return Promise.resolve(task || null);
  }

  public async getTasksByClientId(clientId: string): Promise<Task[]> {
    return Promise.resolve(this.tasks.filter(t => t.clientId === clientId));
  }

  public async getTasksByAssignedTo(assignedTo: string): Promise<Task[]> {
    return Promise.resolve(this.tasks.filter(t => t.assignedTo === assignedTo));
  }

  public async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.push(newTask);
    return Promise.resolve(newTask);
  }

  public async updateTask(id: string, taskData: Partial<Task>): Promise<Task | null> {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return Promise.resolve(null);

    const updatedTask = {
      ...this.tasks[index],
      ...taskData,
      updatedAt: new Date()
    };
    this.tasks[index] = updatedTask;
    return Promise.resolve(updatedTask);
  }

  public async deleteTask(id: string): Promise<boolean> {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== id);
    return Promise.resolve(this.tasks.length < initialLength);
  }

  // User methods
  public async getUsers(): Promise<User[]> {
    return Promise.resolve([...this.users]);
  }

  public async getUserById(id: string): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    return Promise.resolve(user || null);
  }

  public async getUsersByFirmId(firmId: string): Promise<User[]> {
    return Promise.resolve(this.users.filter(u => u.firmId === firmId));
  }

  public async getUsersByRole(role: 'superadmin' | 'admin' | 'attorney' | 'client'): Promise<User[]> {
    return Promise.resolve(this.users.filter(u => u.role === role));
  }

  public async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const newUser: User = {
      ...userData,
      id: uuidv4()
    };
    this.users.push(newUser);
    return Promise.resolve(newUser);
  }

  public async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return Promise.resolve(null);

    const updatedUser = {
      ...this.users[index],
      ...userData
    };
    this.users[index] = updatedUser;
    return Promise.resolve(updatedUser);
  }

  public async deleteUser(id: string): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter(u => u.id !== id);
    return Promise.resolve(this.users.length < initialLength);
  }

  // Firm methods
  public async getFirms(): Promise<Firm[]> {
    return Promise.resolve([...this.firms]);
  }

  public async getFirmById(id: string): Promise<Firm | null> {
    const firm = this.firms.find(f => f.id === id);
    return Promise.resolve(firm || null);
  }

  public async createFirm(firmData: Omit<Firm, 'id' | 'createdAt'>): Promise<Firm> {
    const newFirm: Firm = {
      ...firmData,
      id: uuidv4(),
      createdAt: new Date()
    };
    this.firms.push(newFirm);
    return Promise.resolve(newFirm);
  }

  public async updateFirm(id: string, firmData: Partial<Firm>): Promise<Firm | null> {
    const index = this.firms.findIndex(f => f.id === id);
    if (index === -1) return Promise.resolve(null);

    const updatedFirm = {
      ...this.firms[index],
      ...firmData,
      updatedAt: new Date()
    };
    this.firms[index] = updatedFirm;
    return Promise.resolve(updatedFirm);
  }

  public async deleteFirm(id: string): Promise<boolean> {
    const initialLength = this.firms.length;
    this.firms = this.firms.filter(f => f.id !== id);
    return Promise.resolve(this.firms.length < initialLength);
  }

  private initMockData(): void {
    // Initialize with some mock data
    this.firms = [
      {
        id: 'firm1',
        name: 'LYZ Law Firm',
        address: '123 Legal St, Lawtown, CA 90210',
        contactNumber: '(555) 123-4567',
        email: 'contact@lyzlawfirm.com',
        website: 'www.lyzlawfirm.com',
        adminId: 'admin1',
        status: 'active',
        createdAt: new Date(),
        createdBy: 'superadmin1'
      }
    ];

    this.users = [
      {
        id: 'superadmin1',
        name: 'Super Administrator',
        email: 'superadmin@lawerp.com',
        role: 'superadmin',
        permissions: ['all', 'manage:firms', 'manage:admins', 'view:all'],
      },
      {
        id: 'admin1',
        name: 'Administrator',
        email: 'admin@lawerp.com',
        role: 'admin',
        firmId: 'firm1',
        permissions: ['all', 'create:users', 'manage:users', 'access:all'],
      },
      {
        id: 'attorney1',
        name: 'Attorney User',
        email: 'attorney@lawerp.com',
        role: 'attorney',
        firmId: 'firm1',
        assignedClientIds: ['client1'],
        permissions: [
          'view:clients', 'edit:clients', 
          'view:cases', 'edit:cases',
          'view:documents', 'edit:documents',
          'view:calendar', 'edit:calendar',
          'view:billing', 'edit:billing',
          'view:depositions', 'edit:depositions',
          'view:medical', 'edit:medical',
          'view:messages', 'send:messages'
        ],
      },
      {
        id: 'client1',
        name: 'Client User',
        email: 'client@lawerp.com',
        role: 'client',
        firmId: 'firm1',
        assignedAttorneyId: 'attorney1',
        permissions: [
          'view:documents', 'upload:documents',
          'view:messages', 'send:messages',
          'view:appointments'
        ],
      }
    ];

    // Add sample calendar events
    this.events = [
      {
        id: uuidv4(),
        title: "Client Meeting",
        description: "Initial consultation with new client",
        start: new Date(2025, 3, 20, 10, 0),
        end: new Date(2025, 3, 20, 11, 0),
        allDay: false,
        color: "#4f46e5",
        location: "Office",
        participants: ["client1"],
        createdBy: "attorney1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Court Hearing",
        description: "Case #12345 preliminary hearing",
        start: new Date(2025, 3, 22, 9, 0),
        end: new Date(2025, 3, 22, 12, 0),
        allDay: false,
        color: "#ef4444",
        location: "County Courthouse",
        participants: ["client1"],
        createdBy: "attorney1",
        reminderTime: new Date(2025, 3, 21, 9, 0),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
  }
}
