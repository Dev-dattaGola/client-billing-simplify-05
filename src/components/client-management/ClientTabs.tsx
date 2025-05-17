
import React, { useCallback } from "react";
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

interface ClientTabsProps {
  onSearchClick?: () => void;
}

const ClientTabs: React.FC<ClientTabsProps> = ({ onSearchClick }) => {
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
  
  const { hasPermission, currentUser } = useAuth();

  // Memoize handlers
  const handleRefreshClick = useCallback(() => {
    console.log("Refreshing clients");
    refreshClients();
  }, [refreshClients]);

  // Determine which tabs should be visible based on user role
  const shouldShowAddTab = currentUser && ['admin'].includes(currentUser.role);

  console.log("ClientTabs rendering, active tab:", activeTab);

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
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
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        
        <ClientList 
          clients={clients} 
          onEditClient={(client) => hasPermission('edit:clients') ? startEditClient(client) : null}
          onViewClient={handleViewClient}
          onDropClient={(clientId, reason) => hasPermission('edit:clients') ? handleDropClient(clientId, reason) : undefined}
          loading={loading}
        />
        
        {droppedClients.length > 0 && (
          <>
            <Separator className="my-8 bg-white/20" />
            <DroppedClientsList
              clients={droppedClients}
              onViewClient={handleViewClient}
              onDeleteClient={(clientId) => hasPermission('delete:clients') ? handleDeleteClient(clientId) : null}
              loading={loading}
            />
          </>
        )}
      </TabsContent>
      
      <TabsContent value="add" className="p-6">
        {shouldShowAddTab ? (
          <ClientForm 
            initialData={clientToEdit} 
            onSubmit={clientToEdit ? handleEditClient : handleAddClient} 
            onCancel={() => {
              clearClientToEdit();
              setActiveTab("view");
            }}
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
              onClick={() => setActiveTab("view")}
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
