
import React, { useState, useCallback } from "react";
import ClientTabs from "./ClientTabs";
import ClientSearchSheet from "./ClientSearchSheet";
import { Card } from "@/components/ui/card";
import { useLocation } from "react-router-dom";

const ClientManagement = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  // Check if we're on the /clients/new route
  const isNewClientRoute = location.pathname === "/clients/new";

  // Memoize handlers to prevent re-renders
  const handleSearchClick = useCallback(() => {
    console.log("Search sheet opening");
    setIsSearchOpen(true);
  }, []);
  
  const handleSearchOpenChange = useCallback((open: boolean) => {
    console.log("Search sheet state changing to:", open);
    setIsSearchOpen(open);
  }, []);

  return (
    <Card className="glass-card backdrop-blur-lg border border-white/20 rounded-lg shadow-sm">
      <ClientTabs 
        onSearchClick={handleSearchClick}
        initialTab={isNewClientRoute ? "add" : "view"}
      />
      <ClientSearchSheet 
        isOpen={isSearchOpen}
        onOpenChange={handleSearchOpenChange}
      />
    </Card>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(ClientManagement);
