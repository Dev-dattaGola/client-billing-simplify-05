
import React, { useCallback, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClient } from "@/contexts/client";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, RefreshCw, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ClientList from "./ClientList";
import DroppedClientsList from "./DroppedClientsList";
import ClientForm from "./ClientForm";
import ClientDetailsView from "./ClientDetailsView";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ClientTabsProps {
  onSearchClick?: () => void;
  initialTab?: string;
}

const ClientTabs: React.FC<ClientTabsProps> = ({ onSearchClick, initialTab = "view" }) => {
  const { 
    clients,
    droppedClients,
    selectedClient,
    clientToEdit,
    loading,
    activeTab,
    setActiveTab,
    dropClient,
    deleteClient,
    viewClient,
    editClient,
    clearEditState,
    createClient,
    updateClient,
    loadClients
  } = useClient();
  
  const navigate = useNavigate();
  const { hasPermission, currentUser } = useAuth();

  useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, setActiveTab, activeTab]);

  const handleRefreshClick = useCallback(async () => {
    await loadClients();
    toast.success("Client data refreshed");
  }, [loadClients]);
  
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    
    if (value === "view" && clientToEdit) {
      clearEditState();
    }
    
    if (value === "add") {
      navigate('/clients/new', { replace: true });
    } else if (value === "view") {
      navigate('/clients', { replace: true });
    }
  }, [setActiveTab, navigate, clientToEdit, clearEditState]);

  const handleCancel = useCallback(() => {
    clearEditState();
    setActiveTab("view");
    navigate('/clients', { replace: true });
  }, [clearEditState, setActiveTab, navigate]);

  const handleFormSubmit = useCallback(async (formData) => {
    try {
      let result;
      
      if (clientToEdit) {
        result = await updateClient(formData);
      } else {
        result = await createClient(formData);
      }
      
      if (result) {
        clearEditState();
        setActiveTab("view");
        navigate('/clients', { replace: true });
        return result;
      }
      return null;
    } catch (error) {
      console.error("Error saving client:", error);
      throw error;
    }
  }, [clientToEdit, updateClient, createClient, clearEditState, navigate, setActiveTab]);

  const shouldShowAddTab = currentUser && ['admin'].includes(currentUser.role);

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={handleTabChange}
      className="w-full text-white"
    >
      <div className="border-b border-white/20 px-6 py-2">
        <TabsList className={`grid w-full ${shouldShowAddTab ? 'grid-cols-2' : 'grid-cols-1'} bg-white/10`}>
          <TabsTrigger value="view" className="text-white data-[state=active]:bg-white/20">
            View Clients
          </TabsTrigger>
          
          {shouldShowAddTab && (
            <TabsTrigger value="add" className="text-white data-[state=active]:bg-white/20">
              {clientToEdit ? "Edit Client" : "Add Client"}
            </TabsTrigger>
          )}
        </TabsList>
      </div>
      
      <TabsContent value="view" className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Active Clients ({clients.length})</h2>
          <div className="flex gap-2">
            {onSearchClick && (
              <Button variant="outline" size="sm" onClick={onSearchClick}>
                <Search className="h-4 w-4 mr-1" />
                Search
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleRefreshClick}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
        
        <ClientList 
          clients={clients} 
          onEditClient={(client) => hasPermission('edit:clients') ? editClient(client) : null}
          onViewClient={viewClient}
          onDropClient={(clientId, reason) => hasPermission('edit:clients') ? dropClient(clientId, reason) : Promise.resolve(null)}
          loading={loading}
        />
        
        {droppedClients.length > 0 && (
          <>
            <Separator className="my-8 bg-white/20" />
            <DroppedClientsList
              clients={droppedClients}
              onViewClient={viewClient}
              onDeleteClient={(clientId) => hasPermission('delete:clients') ? deleteClient(clientId) : Promise.resolve(false)}
              loading={loading}
            />
          </>
        )}
      </TabsContent>
      
      <TabsContent value="add" className="p-6">
        {shouldShowAddTab ? (
          <ClientForm 
            initialData={clientToEdit} 
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        ) : (
          <div className="glass-card p-6 rounded-lg border border-white/20 flex flex-col items-center justify-center text-white">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-medium text-white">Access Restricted</h3>
            <p className="text-white/80 text-center mt-2">
              You do not have permission to {clientToEdit ? "edit" : "add"} clients.
            </p>
            <Button variant="outline" className="mt-4" onClick={handleCancel}>
              Back to Client List
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="details" className="p-6 space-y-4">
        {selectedClient && <ClientDetailsView onSearchClick={onSearchClick} />}
      </TabsContent>
    </Tabs>
  );
};

export default React.memo(ClientTabs);
