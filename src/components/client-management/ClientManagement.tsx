
import React, { useState, useCallback, useEffect } from "react";
import ClientTabs from "./ClientTabs";
import ClientSearchSheet from "./ClientSearchSheet";
import { Card } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { useClient } from "@/contexts/client";

const ClientManagement = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { activeTab, setActiveTab } = useClient();

  const isNewClientRoute = location.pathname === "/clients/new";

  useEffect(() => {
    if (isNewClientRoute && activeTab !== "add") {
      setActiveTab("add");
    } else if (!isNewClientRoute && activeTab === "add") {
      const timeout = setTimeout(() => {
        navigate("/clients/new");
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [isNewClientRoute, activeTab, setActiveTab, navigate]);

  const handleSearchClick = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const initialTab = isNewClientRoute ? "add" : "view";

  return (
    <Card className="glass-card backdrop-blur-lg border border-white/20 rounded-lg shadow-sm">
      <ClientTabs 
        onSearchClick={handleSearchClick}
        initialTab={initialTab}
      />
      <ClientSearchSheet 
        isOpen={isSearchOpen}
        onOpenChange={setIsSearchOpen}
      />
    </Card>
  );
};

export default React.memo(ClientManagement);
