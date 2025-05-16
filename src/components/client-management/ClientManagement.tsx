
import React, { useState, useCallback, useMemo } from "react";
import { ClientProvider } from "@/contexts/client";
import ClientTabs from "./ClientTabs";
import ClientSearchSheet from "./ClientSearchSheet";

const ClientManagement = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Memoize handlers to prevent re-renders
  const handleSearchClick = useCallback(() => {
    console.log("Search sheet opening");
    setIsSearchOpen(true);
  }, []);
  
  const handleSearchOpenChange = useCallback((open: boolean) => {
    console.log("Search sheet state changing to:", open);
    setIsSearchOpen(open);
  }, []);

  // Using ClientProvider at this level prevents re-creating the context 
  // when child components re-render
  console.log("ClientManagement rendering");
  
  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <ClientProvider>
        <ClientTabs onSearchClick={handleSearchClick} />
        <ClientSearchSheet 
          isOpen={isSearchOpen}
          onOpenChange={handleSearchOpenChange}
        />
      </ClientProvider>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(ClientManagement);
