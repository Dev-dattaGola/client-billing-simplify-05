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
  const fetchInitiated = useRef(false);
  const { toast } = useToast();

  // Using useCallback to prevent recreation of this function on every render
  const fetchClients = useCallback(async () => {
    if (fetchInitiated.current) return;
    
    fetchInitiated.current = true;
    
    try {
      const fetchedClients = await clientsApi.getClients();
      setClients(fetchedClients);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
      toast({
        title: "Error",
        description: "Failed to load client data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Use a separate effect for data fetching to avoid rendering loops
  useEffect(() => {
    if (!fetchInitiated.current) {
      fetchClients();
    }
    // Only depend on fetchClients
  }, [fetchClients]);

  const toggleCalculator = useCallback(() => {
    setShowCalculator(prev => !prev);
  }, []);

  // Using useMemo to memoize the initial tab value
  const defaultTabValue = useMemo(() => "billings", []);

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

      {showCalculator && (
        <Card>
          <CardContent className="p-6">
            <LienCalculator />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue={defaultTabValue}>
        <TabsList className="mb-4">
          <TabsTrigger value="billings">Billings</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="billings">
          {loading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <BillingTable />
          )}
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
