
import React, { useState, useCallback } from "react";
import { ClientProvider } from "@/contexts/client";
import ClientTabs from "./ClientTabs";
import ClientSearchSheet from "./ClientSearchSheet";

const ClientManagement = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Memoize handlers to prevent re-renders
  const handleSearchClick = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <ClientProvider>
        <ClientTabs />
        <ClientSearchSheet 
          isOpen={isSearchOpen}
          onOpenChange={setIsSearchOpen}
        />
      </ClientProvider>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(ClientManagement);
