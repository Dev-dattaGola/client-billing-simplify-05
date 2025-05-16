
import React, { useCallback } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { useClient } from "@/contexts/client";
import { useAuth } from "@/contexts/AuthContext";
import ClientList from "./ClientList";

interface ClientSearchSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ClientSearchSheet: React.FC<ClientSearchSheetProps> = ({ 
  isOpen, 
  onOpenChange 
}) => {
  const { 
    clients, 
    loading, 
    handleViewClient, 
    handleDropClient, 
    startEditClient 
  } = useClient();
  
  const { hasPermission } = useAuth();

  const handleViewAndClose = useCallback((client: any) => {
    console.log("Viewing client and closing sheet");
    handleViewClient(client);
    onOpenChange(false);
  }, [handleViewClient, onOpenChange]);

  console.log("ClientSearchSheet rendering, isOpen:", isOpen);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[640px] sm:max-w-full">
        <SheetHeader>
          <SheetTitle>Search Clients</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <ClientList 
            clients={clients} 
            onEditClient={(client) => hasPermission('edit:clients') ? startEditClient(client) : null}
            onViewClient={handleViewAndClose}
            onDropClient={(clientId, reason) => hasPermission('edit:clients') ? handleDropClient(clientId, reason) : undefined}
            loading={loading}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default React.memo(ClientSearchSheet);
