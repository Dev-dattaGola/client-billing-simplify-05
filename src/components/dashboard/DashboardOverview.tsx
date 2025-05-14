
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import BillingTable from "../client-billing/BillingTable";
import LienCalculator from "../calculator/LienCalculator";
import ClientAnalyticsChart from "./ClientAnalyticsChart";
import { clientsApi } from "@/lib/api/mongodb-api";
import { Client } from "@/types/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardOverview = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Use ref to track initialization and prevent multiple fetch calls
  const isMountedRef = useRef(true);
  const hasBeenInitializedRef = useRef(false);

  // Use useEffect with proper cleanup and fetch tracking
  useEffect(() => {
    // Skip fetching if we've already initialized or if the component is unmounting
    if (!isMountedRef.current || hasBeenInitializedRef.current) {
      return;
    }
    
    // Mark as initialized to prevent duplicate fetches
    hasBeenInitializedRef.current = true;
    
    const fetchData = async () => {
      if (!isMountedRef.current) return;
      
      try {
        const fetchedClients = await clientsApi.getClients();
        
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setClients(fetchedClients);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch clients:", error);
        
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          toast({
            title: "Error",
            description: "Failed to load client data. Please try again later.",
            variant: "destructive",
          });
          setLoading(false);
        }
      }
    };
    
    // Add a slight delay to prevent render issues during initial mount
    const timer = setTimeout(fetchData, 100);
    
    // Cleanup function
    return () => {
      isMountedRef.current = false;
      clearTimeout(timer);
    };
  }, [toast]); // Only depend on toast

  // Memoize toggle function to prevent recreation on each render
  const toggleCalculator = useCallback(() => {
    setShowCalculator(prev => !prev);
  }, []);

  // Default tab value
  const defaultTabValue = "billings";

  // Memoize calculator content to prevent re-renders
  const calculatorContent = useMemo(() => {
    if (!showCalculator) return null;
    
    return (
      <Card>
        <CardContent className="p-6">
          <LienCalculator />
        </CardContent>
      </Card>
    );
  }, [showCalculator]);

  // Memoize billing content
  const billingContent = useMemo(() => {
    if (loading) {
      return <Skeleton className="h-[300px] w-full" />;
    }
    return <BillingTable />;
  }, [loading]);

  return (
    <div className="space-y-8">
      <div className="space-y-3 pt-2">
        <h1 className="text-2xl font-bold tracking-tight">Client Billings</h1>
        <p className="text-muted-foreground">
          Manage client billing, view analytics, and access important documents.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ClientAnalyticsChart />
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={toggleCalculator} 
          variant="outline"
          className="flex items-center gap-1"
        >
          {showCalculator ? "Hide Calculator" : "Show Lien Calculator"}
          <ChevronDown className={`h-4 w-4 transition-transform ${showCalculator ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {calculatorContent}

      <Tabs defaultValue={defaultTabValue}>
        <TabsList className="mb-4">
          <TabsTrigger value="billings">Billings</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="billings">
          {billingContent}
        </TabsContent>
        <TabsContent value="clients">
          <Card>
            <CardContent className="p-6">
              <p className="text-center py-8 text-muted-foreground">
                Client management section would appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents">
          <Card>
            <CardContent className="p-6">
              <p className="text-center py-8 text-muted-foreground">
                Document management section would appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardContent className="p-6">
              <p className="text-center py-8 text-muted-foreground">
                Reports section would appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardOverview;
