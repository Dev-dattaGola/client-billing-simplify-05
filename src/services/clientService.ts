
import { Client } from '@/types/client';
import { CreateClientData, UpdateClientData } from './client/types';
import { ClientCrudService } from './client/clientCrudService';
import { ClientCreationService } from './client/clientCreationService';

class ClientService {
  private crudService = new ClientCrudService();
  private creationService = new ClientCreationService();

  async getAllClients(): Promise<{ active: Client[]; dropped: Client[] }> {
    return this.crudService.getAllClients();
  }

  async createClient(clientData: CreateClientData): Promise<Client> {
    return this.creationService.createClient(clientData);
  }

  async updateClient(clientData: UpdateClientData): Promise<Client> {
    return this.crudService.updateClient(clientData);
  }

  async dropClient(clientId: string, reason: string): Promise<Client> {
    return this.crudService.dropClient(clientId, reason);
  }

  async deleteClient(clientId: string): Promise<void> {
    return this.crudService.deleteClient(clientId);
  }

  async getClientById(clientId: string): Promise<Client | null> {
    return this.crudService.getClientById(clientId);
  }
}

export const clientService = new ClientService();
export type { CreateClientData, UpdateClientData };
