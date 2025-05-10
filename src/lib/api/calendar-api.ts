
import { v4 as uuidv4 } from 'uuid';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: 'meeting' | 'appointment' | 'deposition' | 'deadline' | 'reminder';
  startDate: string;
  endDate: string;
  location?: string;
  attendees?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  assignedTo?: string;
  associatedCaseId?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data for events
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Client Meeting - John Doe',
    description: 'Initial consultation regarding personal injury case',
    type: 'meeting',
    startDate: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    endDate: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    location: 'Office - Conference Room A',
    attendees: ['John Doe', 'Jane Smith'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    title: 'Deposition - Williams v. City Transport',
    description: 'Deposition of key witness Dr. Johnson',
    type: 'deposition',
    startDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    location: 'Smith & Associates - Deposition Room',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '3',
    title: 'Filing Deadline - Johnson Case',
    description: 'Last day to file motion for summary judgment',
    type: 'deadline',
    startDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '4',
    title: 'Case Review - Smith v. Insurance Co.',
    description: 'Internal review of case progress and strategy',
    type: 'meeting',
    startDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    location: 'Conference Room B',
    attendees: ['Jane Smith', 'Michael Johnson', 'Sarah Williams'],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 345600000).toISOString(),
  },
];

// Mock data for tasks
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Draft Motion for Discovery',
    description: 'Prepare initial draft of motion to compel discovery responses',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    priority: 'high',
    status: 'todo',
    assignedTo: 'Jane Smith',
    associatedCaseId: 'case123',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    title: 'Review Medical Records',
    description: 'Review client medical records for inconsistencies',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    priority: 'medium',
    status: 'in-progress',
    assignedTo: 'Michael Johnson',
    associatedCaseId: 'case456',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'File Court Documents',
    description: 'File response to defendant\'s motion to dismiss',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    priority: 'high',
    status: 'todo',
    assignedTo: 'Sarah Williams',
    associatedCaseId: 'case789',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '4',
    title: 'Schedule Client Meeting',
    description: 'Set up meeting with client to discuss settlement options',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    priority: 'low',
    status: 'completed',
    assignedTo: 'Jane Smith',
    associatedCaseId: 'case123',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

// Calendar Event API functions
export const calendarApi = {
  // Get all events
  getEvents: async (): Promise<CalendarEvent[]> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockEvents];
  },

  // Get a single event by ID
  getEvent: async (id: string): Promise<CalendarEvent> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 200));
    const event = mockEvents.find(e => e.id === id);
    
    if (!event) {
      throw new Error('Event not found');
    }
    
    return event;
  },

  // Create a new event
  createEvent: async (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<CalendarEvent> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const now = new Date().toISOString();
    const newEvent: CalendarEvent = {
      ...eventData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    mockEvents.push(newEvent);
    
    return newEvent;
  },

  // Update an existing event
  updateEvent: async (id: string, eventData: Partial<Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>>): Promise<CalendarEvent> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const eventIndex = mockEvents.findIndex(e => e.id === id);
    
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }
    
    const updatedEvent: CalendarEvent = {
      ...mockEvents[eventIndex],
      ...eventData,
      updatedAt: new Date().toISOString(),
    };
    
    mockEvents[eventIndex] = updatedEvent;
    
    return updatedEvent;
  },

  // Delete an event
  deleteEvent: async (id: string): Promise<boolean> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const eventIndex = mockEvents.findIndex(e => e.id === id);
    
    if (eventIndex === -1) {
      return false;
    }
    
    mockEvents.splice(eventIndex, 1);
    
    return true;
  },

  // Get events by date range
  getEventsByDateRange: async (startDate: string, endDate: string): Promise<CalendarEvent[]> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return mockEvents.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate >= start && eventDate <= end;
    });
  },
};

// Task API functions
export const tasksApi = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockTasks];
  },

  // Get a single task by ID
  getTask: async (id: string): Promise<Task> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 200));
    const task = mockTasks.find(t => t.id === id);
    
    if (!task) {
      throw new Error('Task not found');
    }
    
    return task;
  },

  // Create a new task
  createTask: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const now = new Date().toISOString();
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    mockTasks.push(newTask);
    
    return newTask;
  },

  // Update an existing task
  updateTask: async (id: string, taskData: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Task> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const taskIndex = mockTasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask: Task = {
      ...mockTasks[taskIndex],
      ...taskData,
      updatedAt: new Date().toISOString(),
    };
    
    mockTasks[taskIndex] = updatedTask;
    
    return updatedTask;
  },

  // Delete a task
  deleteTask: async (id: string): Promise<boolean> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const taskIndex = mockTasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
      return false;
    }
    
    mockTasks.splice(taskIndex, 1);
    
    return true;
  },

  // Get tasks by status
  getTasksByStatus: async (status: Task['status']): Promise<Task[]> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockTasks.filter(task => task.status === status);
  },

  // Get tasks by assigned user
  getTasksByAssignedUser: async (userId: string): Promise<Task[]> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockTasks.filter(task => task.assignedTo === userId);
  },
};
