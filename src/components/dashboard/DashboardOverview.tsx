
import { useState, useEffect } from "react";
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

const DashboardOverview = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
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
    };

    fetchClients();
  }, [toast]);

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
            <div className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Loading client data...</p>
            </div>
          ) : (
            <ClientAnalyticsChart />
          )}
        </CardContent>
      </Card>

      {showCalculator && (
        <Card>
          <CardContent className="p-6">
            <LienCalculator />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="billings">
        <TabsList className="mb-4">
          <TabsTrigger value="billings">Billings</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="billings">
          <BillingTable />
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
