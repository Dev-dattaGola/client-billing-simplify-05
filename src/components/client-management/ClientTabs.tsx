
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClient } from "@/contexts/ClientContext";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ClientList from "./ClientList";
import DroppedClientsList from "./DroppedClientsList";
import ClientForm from "./ClientForm";
import ClientDetailsView from "./ClientDetailsView";
import { Separator } from "@/components/ui/separator";

const ClientTabs = () => {
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

  // Determine which tabs should be visible based on user role
  const shouldShowAddTab = currentUser && ['admin'].includes(currentUser.role);

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full"
    >
      <div className="border-b px-6 py-2">
        <TabsList className={`grid w-full ${shouldShowAddTab ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <TabsTrigger value="view">View Clients</TabsTrigger>
          
          {shouldShowAddTab && (
            <TabsTrigger value="add">{clientToEdit ? "Edit Client" : "Add Client"}</TabsTrigger>
          )}
        </TabsList>
      </div>
      
      <TabsContent value="view" className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Active Clients</h2>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={refreshClients}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
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
            <Separator className="my-8" />
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
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 flex flex-col items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-medium text-yellow-800">Access Restricted</h3>
            <p className="text-yellow-600 text-center mt-2">
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
        {selectedClient && <ClientDetailsView />}
      </TabsContent>
    </Tabs>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(ClientTabs);
