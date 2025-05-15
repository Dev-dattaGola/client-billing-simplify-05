import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client } from '@/types/client';
import { useToast } from '@/hooks/use-toast';

interface ClientContextType {
  clients: Client[];
  selectedClient: Client | null;
  clientToEdit: Client | null;
  loading: boolean;
  activeTab: string;
  activeDetailTab: string;
  setActiveTab: (tab: string) => void;
  setActiveDetailTab: (tab: string) => void;
  handleAddClient: (client: Omit<Client, "id">) => void;
  handleEditClient: (client: Client) => void;
  handleDeleteClient: (client: Client) => void;
  handleViewClient: (client: Client) => void;
  startEditClient: (client: Client) => void;
  clearClientToEdit: () => void;
  transferClient: (client: Client, attorneyId: string, attorneyName: string) => void;
  dropClient: (client: Client, reason: string) => void;
}

const ClientContext = createContext<ClientContextType>({
  clients: [],
  selectedClient: null,
  clientToEdit: null,
  loading: true,
  activeTab: 'view',
  activeDetailTab: 'overview',
  setActiveTab: () => {},
  setActiveDetailTab: () => {},
  handleAddClient: () => {},
  handleEditClient: () => {},
  handleDeleteClient: () => {},
  handleViewClient: () => {},
  startEditClient: () => {},
  clearClientToEdit: () => {},
  transferClient: () => {},
  dropClient: () => {},
});

export const useClient = () => useContext(ClientContext);

interface ClientProviderProps {
  children: React.ReactNode;
}

// Mock client data
const initialClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, New York, NY 10001',
    status: 'active',
    assignedAttorney: 'Jane Doe',
    caseType: 'Personal Injury',
    caseStatus: 'Active',
    dateOfBirth: '1985-05-15',
    createdAt: new Date('2023-01-15').toISOString(),
  },
  {
    id: '2',
    name: 'Mary Johnson',
    email: 'mary@example.com',
    phone: '(555) 987-6543',
    address: '456 Park Ave, New York, NY 10022',
    status: 'active',
    assignedAttorney: 'Robert Williams',
    caseType: 'Family Law',
    caseStatus: 'Active',
    dateOfBirth: '1990-08-22',
    createdAt: new Date('2023-02-10').toISOString(),
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    phone: '(555) 456-7890',
    address: '789 Broadway, New York, NY 10012',
    status: 'inactive',
    assignedAttorney: 'Jane Doe',
    caseType: 'Estate Planning',
    caseStatus: 'Closed',
    dateOfBirth: '1975-11-30',
    createdAt: new Date('2022-11-05').toISOString(),
  },
];

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('view');
  const [activeDetailTab, setActiveDetailTab] = useState<string>('overview');
  const { toast } = useToast();

  useEffect(() => {
    // Here you would normally fetch clients from an API
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleAddClient = (client: Omit<Client, "id">) => {
    const newClient = {
      ...client,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    setClients([...clients, newClient]);
    setActiveTab('view');
    toast({
      title: "Client added",
      description: `${newClient.name} has been added successfully.`,
    });
  };

  const handleEditClient = (client: Client) => {
    setClients(clients.map(c => c.id === client.id ? client : c));
    setClientToEdit(null);
    setActiveTab('view');
    
    // Update selected client if it's the one being edited
    if (selectedClient && selectedClient.id === client.id) {
      setSelectedClient(client);
    }
    
    toast({
      title: "Client updated",
      description: `${client.name}'s information has been updated.`,
    });
  };

  const handleDeleteClient = (client: Client) => {
    setClients(clients.filter(c => c.id !== client.id));
    
    // Clear selected client if it's the one being deleted
    if (selectedClient && selectedClient.id === client.id) {
      setSelectedClient(null);
      setActiveTab('view');
    }
    
    toast({
      title: "Client deleted",
      description: `${client.name} has been removed from clients.`,
      variant: "destructive",
    });
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setActiveTab('details');
    setActiveDetailTab('overview');
  };

  const startEditClient = (client: Client) => {
    setClientToEdit(client);
    setActiveTab('add');
  };

  const clearClientToEdit = () => {
    setClientToEdit(null);
  };
  
  // New function to transfer client to another attorney
  const transferClient = (client: Client, attorneyId: string, attorneyName: string) => {
    setClients(clients.map(c => {
      if (c.id === client.id) {
        return {
          ...c,
          assignedAttorney: attorneyName,
          assignedAttorneyId: attorneyId
        };
      }
      return c;
    }));
    
    // Update selected client if it's being transferred
    if (selectedClient && selectedClient.id === client.id) {
      setSelectedClient({
        ...selectedClient,
        assignedAttorney: attorneyName,
        assignedAttorneyId: attorneyId
      });
    }
    
    toast({
      title: "Client transferred",
      description: `Client has been transferred to ${attorneyName}.`,
    });
  };
  
  // New function to drop a client
  const dropClient = (client: Client, reason: string) => {
    // Update client status to dropped
    setClients(clients.map(c => {
      if (c.id === client.id) {
        return {
          ...c,
          status: 'dropped',
          dropReason: reason
        };
      }
      return c;
    }));
    
    // If selected client is being dropped, update it
    if (selectedClient && selectedClient.id === client.id) {
      setSelectedClient({
        ...selectedClient,
        status: 'dropped',
        dropReason: reason
      });
      
      // Move back to client list view
      setActiveTab('view');
    }
    
    toast({
      title: "Client dropped",
      description: "Client has been dropped from the firm.",
    });
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        selectedClient,
        clientToEdit,
        loading,
        activeTab,
        activeDetailTab,
        setActiveTab,
        setActiveDetailTab,
        handleAddClient,
        handleEditClient,
        handleDeleteClient,
        handleViewClient,
        startEditClient,
        clearClientToEdit,
        transferClient,
        dropClient
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};
