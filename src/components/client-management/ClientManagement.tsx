
import React, { useState, useCallback, useEffect } from "react";
import ClientTabs from "./ClientTabs";
import ClientSearchSheet from "./ClientSearchSheet";
import { Card } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { useClient } from "@/contexts/client/ClientContext";

const ClientManagement = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { activeTab, setActiveTab } = useClient();

  const isNewClientRoute = location.pathname === "/clients/new";
  
  console.log("ClientManagement rendering, location:", location.pathname, "isNewClientRoute:", isNewClientRoute, "activeTab:", activeTab);

  useEffect(() => {
    if (isNewClientRoute && activeTab !== "add") {
      console.log("Route is /clients/new but tab is not add, updating tab");
      setActiveTab("add");
    } else if (!isNewClientRoute && activeTab === "add") {
      console.log("Tab is add but route is not /clients/new, updating route");
      const timeout = setTimeout(() => {
        navigate("/clients/new");
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [isNewClientRoute, activeTab, setActiveTab, navigate]);

  const handleSearchClick = useCallback(() => {
    console.log("Search sheet opening");
    setIsSearchOpen(true);
  }, []);
  
  const handleSearchOpenChange = useCallback((open: boolean) => {
    console.log("Search sheet state changing to:", open);
    setIsSearchOpen(open);
  }, []);

  const initialTab = isNewClientRoute ? "add" : "view";
  console.log("Setting initial tab to:", initialTab);

  return (
    <Card className="glass-card backdrop-blur-lg border border-white/20 rounded-lg shadow-sm">
      <ClientTabs 
        onSearchClick={handleSearchClick}
        initialTab={initialTab}
      />
      <ClientSearchSheet 
        isOpen={isSearchOpen}
        onOpenChange={handleSearchOpenChange}
      />
    </Card>
  );
};

export default React.memo(ClientManagement);
