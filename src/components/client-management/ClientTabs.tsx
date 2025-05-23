
import React, { useCallback, useEffect, useRef } from "react";
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
    handleDropClient,
    handleDeleteClient,
    handleViewClient,
    startEditClient,
    clearClientToEdit,
    handleAddClient,
    handleEditClient,
    refreshClients
  } = useClient();
  
  const navigate = useNavigate();
  const { hasPermission, currentUser } = useAuth();
  const initialRender = useRef(true);

  // Set initial tab if provided, but only on initial render
  useEffect(() => {
    if (initialRender.current && initialTab && initialTab !== activeTab) {
      console.log("Setting initial tab to:", initialTab);
      initialRender.current = false;
      setActiveTab(initialTab);
    }
  }, [initialTab, setActiveTab, activeTab]);

  // Memoize handlers to prevent unnecessary re-renders
  const handleRefreshClick = useCallback(() => {
    console.log("Refreshing clients");
    refreshClients();
  }, [refreshClients]);
  
  const handleTabChange = useCallback((value: string) => {
    console.log("Tab changing to:", value);
    
    // Update URL when tab changes
    if (value === "add") {
      const timeout = setTimeout(() => {
        navigate('/clients/new');
      }, 0);
      return () => clearTimeout(timeout);
    } else if (value === "view") {
      const timeout = setTimeout(() => {
        navigate('/clients');
      }, 0);
      return () => clearTimeout(timeout);
    }
    
    setActiveTab(value);
  }, [setActiveTab, navigate]);

  // Memoize the cancel handler
  const handleCancel = useCallback(() => {
    clearClientToEdit();
    // Navigate back to client list
    const timeout = setTimeout(() => {
      navigate('/clients');
    }, 0);
    return () => clearTimeout(timeout);
  }, [clearClientToEdit, navigate]);

  // Determine which tabs should be visible based on user role
  const shouldShowAddTab = currentUser && ['admin'].includes(currentUser.role);

  console.log("ClientTabs rendering, active tab:", activeTab);

  // Wrap handlers in useCallback to prevent re-renders
  const handleOnEditClient = useCallback((client) => {
    if (hasPermission && hasPermission('edit:clients')) {
      startEditClient(client);
      // Update URL to reflect edit mode
      const timeout = setTimeout(() => {
        navigate('/clients/new');
      }, 0);
      return () => clearTimeout(timeout);
    }
    return null;
  }, [hasPermission, startEditClient, navigate]);

  const handleOnDropClient = useCallback((clientId, reason) => {
    if (hasPermission && hasPermission('edit:clients')) {
      return handleDropClient(clientId, reason);
    }
    return Promise.resolve(null);
  }, [hasPermission, handleDropClient]);

  const handleOnDeleteClient = useCallback((clientId) => {
    if (hasPermission && hasPermission('delete:clients')) {
      return handleDeleteClient(clientId);
    }
    return Promise.resolve(false);
  }, [hasPermission, handleDeleteClient]);

  // Memoize form submit handler with explicit navigation
  const handleFormSubmit = useCallback(async (formData) => {
    console.log("Form submit handler called", formData);
    try {
      let result;
      
      if (clientToEdit) {
        console.log("Editing existing client");
        result = await handleEditClient(formData);
      } else {
        console.log("Adding new client");
        result = await handleAddClient(formData);
      }
      
      if (result) {
        console.log("Client saved successfully, navigating to view tab");
        
        // Ensure we clear the edit state
        clearClientToEdit();
        
        // Schedule navigation for next tick to avoid render-during-render issues
        const timeout = setTimeout(() => {
          console.log("Navigating to client list after successful save");
          navigate('/clients');
          setActiveTab("view");
        }, 0);
        
        return result;
      }
      
      return result;
    } catch (error) {
      console.error("Error saving client:", error);
      toast.error("Failed to save client data");
      return null;
    }
  }, [clientToEdit, handleEditClient, handleAddClient, clearClientToEdit, navigate, setActiveTab]);

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={handleTabChange}
      className="w-full text-white"
    >
      <div className="border-b border-white/20 px-6 py-2">
        <TabsList className={`grid w-full ${shouldShowAddTab ? 'grid-cols-2' : 'grid-cols-1'} bg-white/10`}>
          <TabsTrigger value="view" className="text-white data-[state=active]:bg-white/20">View Clients</TabsTrigger>
          
          {shouldShowAddTab && (
            <TabsTrigger value="add" className="text-white data-[state=active]:bg-white/20">{clientToEdit ? "Edit Client" : "Add Client"}</TabsTrigger>
          )}
        </TabsList>
      </div>
      
      <TabsContent value="view" className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Active Clients</h2>
          <div className="flex gap-2">
            {onSearchClick && (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={onSearchClick}
                type="button"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={handleRefreshClick}
              type="button"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        
        <ClientList 
          clients={clients} 
          onEditClient={handleOnEditClient}
          onViewClient={handleViewClient}
          onDropClient={handleOnDropClient}
          loading={loading}
        />
        
        {droppedClients.length > 0 && (
          <>
            <Separator className="my-8 bg-white/20" />
            <DroppedClientsList
              clients={droppedClients}
              onViewClient={handleViewClient}
              onDeleteClient={handleOnDeleteClient}
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
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={handleCancel}
              type="button"
            >
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

// Memoize the component to prevent unnecessary re-renders
export default React.memo(ClientTabs);
