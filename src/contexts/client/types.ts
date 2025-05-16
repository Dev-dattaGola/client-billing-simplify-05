
import { Client } from '@/types/client';

export interface ClientContextType {
  clients: Client[];
  droppedClients: Client[];
  selectedClient: Client | null;
  clientToEdit: Client | null;
  loading: boolean;
  activeTab: string;
  activeDetailTab: string;
  setActiveTab: (tab: string) => void;
  setActiveDetailTab: (tab: string) => void;
  handleAddClient: (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  handleEditClient: (clientData: Client) => Promise<void>;
  handleDeleteClient: (clientId: string) => Promise<void>;
  handleDropClient: (clientId: string, reason: string) => Promise<void>;
  handleViewClient: (client: Client) => void;
  startEditClient: (client: Client) => void;
  clearClientToEdit: () => void;
  refreshClients: () => Promise<void>;
}
