
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/types/user';

export interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  role: 'superadmin' | 'admin' | 'attorney' | 'client';
  firmId?: string;
  assignedAttorneyId?: string;
  permissions?: string[];
}

class UserManagementService {
  private static instance: UserManagementService;
  private users: Map<string, User> = new Map();
  
  // Use singleton pattern to ensure we have only one instance
  public static getInstance(): UserManagementService {
    if (!UserManagementService.instance) {
      UserManagementService.instance = new UserManagementService();
      UserManagementService.instance.loadUsers();
    }
    return UserManagementService.instance;
  }
  
  // Get all users
  public getUsers(): User[] {
    return Array.from(this.users.values());
  }
  
  // Get user by ID
  public getUserById(id: string): User | undefined {
    return this.users.get(id);
  }
  
  // Get user by email
  public getUserByEmail(email: string): User | undefined {
    const normalizedEmail = email.toLowerCase().trim();
    return Array.from(this.users.values()).find(
      user => user.email.toLowerCase() === normalizedEmail
    );
  }
  
  // Create a new user
  public createUser(params: CreateUserParams): User {
    // Check if email is already in use
    const existingUser = this.getUserByEmail(params.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }
    
    const id = uuidv4();
    
    const user: User = {
      id,
      name: params.name,
      email: params.email,
      role: params.role,
      firmId: params.firmId,
      assignedAttorneyId: params.assignedAttorneyId,
      permissions: params.permissions || this.getDefaultPermissions(params.role)
    };
    
    this.users.set(id, user);
    
    // Store the password separately for authentication
    // In a real app, this would be hashed
    localStorage.setItem(`user_password_${id}`, params.password);
    
    this.saveUsers();
    
    return user;
  }
  
  // Update user
  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(id);
    
    if (!user) {
      return undefined;
    }
    
    // If email is being updated, check if it's already in use
    if (updates.email && updates.email !== user.email) {
      const normalizedEmail = updates.email.toLowerCase().trim();
      const existingUser = Array.from(this.users.values()).find(
        u => u.id !== id && u.email.toLowerCase() === normalizedEmail
      );
      
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    this.saveUsers();
    
    return updatedUser;
  }
  
  // Delete user
  public deleteUser(id: string): boolean {
    const result = this.users.delete(id);
    
    if (result) {
      // Remove password
      localStorage.removeItem(`user_password_${id}`);
      this.saveUsers();
    }
    
    return result;
  }
  
  // Authenticate user
  public authenticateUser(email: string, password: string): User | undefined {
    const user = this.getUserByEmail(email);
    
    if (!user) {
      return undefined;
    }
    
    const storedPassword = localStorage.getItem(`user_password_${user.id}`);
    
    if (storedPassword === password) {
      return user;
    }
    
    return undefined;
  }
  
  // Change user password
  public changePassword(id: string, currentPassword: string, newPassword: string): boolean {
    const user = this.users.get(id);
    
    if (!user) {
      return false;
    }
    
    const storedPassword = localStorage.getItem(`user_password_${id}`);
    
    if (storedPassword === currentPassword) {
      localStorage.setItem(`user_password_${id}`, newPassword);
      return true;
    }
    
    return false;
  }
  
  // Reset user password (admin function)
  public resetPassword(id: string, newPassword: string): boolean {
    const user = this.users.get(id);
    
    if (!user) {
      return false;
    }
    
    localStorage.setItem(`user_password_${id}`, newPassword);
    return true;
  }
  
  // Get all attorneys
  public getAllAttorneys(): User[] {
    return Array.from(this.users.values()).filter(user => user.role === 'attorney');
  }
  
  // Get all clients
  public getAllClients(): User[] {
    return Array.from(this.users.values()).filter(user => user.role === 'client');
  }
  
  // Get clients assigned to attorney
  public getClientsForAttorney(attorneyId: string): User[] {
    return Array.from(this.users.values()).filter(
      user => user.role === 'client' && user.assignedAttorneyId === attorneyId
    );
  }
  
  // Get attorney for client
  public getAttorneyForClient(clientId: string): User | undefined {
    const client = this.users.get(clientId);
    
    if (!client || !client.assignedAttorneyId) {
      return undefined;
    }
    
    return this.users.get(client.assignedAttorneyId);
  }
  
  // Assign client to attorney
  public assignClientToAttorney(clientId: string, attorneyId: string): boolean {
    const client = this.users.get(clientId);
    const attorney = this.users.get(attorneyId);
    
    if (!client || !attorney || client.role !== 'client' || attorney.role !== 'attorney') {
      return false;
    }
    
    client.assignedAttorneyId = attorneyId;
    
    // Add client to attorney's assigned clients
    if (!attorney.assignedClientIds) {
      attorney.assignedClientIds = [clientId];
    } else if (!attorney.assignedClientIds.includes(clientId)) {
      attorney.assignedClientIds.push(clientId);
    }
    
    this.saveUsers();
    
    return true;
  }
  
  // Get default permissions for role
  private getDefaultPermissions(role: string): string[] {
    switch (role) {
      case 'superadmin':
        return ['all'];
      case 'admin':
        return [
          'view:users', 'create:users', 'edit:users', 'delete:users',
          'view:clients', 'create:clients', 'edit:clients', 'delete:clients',
          'view:cases', 'create:cases', 'edit:cases', 'delete:cases',
          'view:documents', 'upload:documents', 'download:documents', 'delete:documents',
          'view:calendar', 'create:events', 'edit:events', 'delete:events',
          'view:reports', 'create:reports',
          'view:billing', 'edit:billing'
        ];
      case 'attorney':
        return [
          'view:clients', 'edit:clients',
          'view:cases', 'create:cases', 'edit:cases',
          'view:documents', 'upload:documents', 'download:documents',
          'view:calendar', 'create:events', 'edit:events',
          'view:reports'
        ];
      case 'client':
        return [
          'view:documents', 'upload:documents', 'download:documents',
          'view:calendar', 'view:appointments',
          'view:messages', 'send:messages'
        ];
      default:
        return [];
    }
  }
  
  // Save users to localStorage
  private saveUsers(): void {
    try {
      const usersArray = Array.from(this.users.entries());
      localStorage.setItem('users', JSON.stringify(usersArray));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }
  
  // Load users from localStorage
  private loadUsers(): void {
    try {
      // Add default users if none exist
      this.addDefaultUsers();
      
      const usersJson = localStorage.getItem('users');
      
      if (usersJson) {
        const usersArray = JSON.parse(usersJson);
        
        for (const [id, user] of usersArray) {
          this.users.set(id, user);
        }
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }
  
  // Add default users
  private addDefaultUsers(): void {
    // Check if we already have users
    if (localStorage.getItem('users')) {
      return;
    }
    
    // Create default users
    const adminUser: CreateUserParams = {
      name: 'Admin User',
      email: 'admin@lyzlawfirm.com',
      password: 'admin123',
      role: 'admin',
      firmId: 'firm1',
      permissions: ['all']
    };
    
    const attorneyUser: CreateUserParams = {
      name: 'Attorney User',
      email: 'attorney@lyzlawfirm.com',
      password: 'attorney123',
      role: 'attorney',
      firmId: 'firm1'
    };
    
    const clientUser: CreateUserParams = {
      name: 'Client User',
      email: 'client@example.com',
      password: 'client123',
      role: 'client'
    };
    
    // Create users
    const admin = this.createUser(adminUser);
    const attorney = this.createUser(attorneyUser);
    const client = this.createUser(clientUser);
    
    // Assign client to attorney
    this.assignClientToAttorney(client.id, attorney.id);
  }
}

export default UserManagementService;

// React hook to use user management
export const useUserManagement = () => {
  const userService = UserManagementService.getInstance();
  
  return {
    getUsers: userService.getUsers.bind(userService),
    getUserById: userService.getUserById.bind(userService),
    getUserByEmail: userService.getUserByEmail.bind(userService),
    createUser: userService.createUser.bind(userService),
    updateUser: userService.updateUser.bind(userService),
    deleteUser: userService.deleteUser.bind(userService),
    authenticateUser: userService.authenticateUser.bind(userService),
    changePassword: userService.changePassword.bind(userService),
    resetPassword: userService.resetPassword.bind(userService),
    getAllAttorneys: userService.getAllAttorneys.bind(userService),
    getAllClients: userService.getAllClients.bind(userService),
    getClientsForAttorney: userService.getClientsForAttorney.bind(userService),
    getAttorneyForClient: userService.getAttorneyForClient.bind(userService),
    assignClientToAttorney: userService.assignClientToAttorney.bind(userService)
  };
};
