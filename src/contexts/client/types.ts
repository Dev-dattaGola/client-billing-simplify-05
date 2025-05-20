
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
  handleAddClient: (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Client | null>;
  handleEditClient: (clientData: Client) => Promise<Client | null>;
  handleDeleteClient: (clientId: string) => Promise<boolean>;
  handleDropClient: (clientId: string, reason: string) => Promise<Client | null>;
  handleViewClient: (client: Client) => void;
  startEditClient: (client: Client) => void;
  clearClientToEdit: () => void;
  refreshClients: () => Promise<void>;
}
