
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, BarChart3, FileText, ChevronDown } from "lucide-react";
import BillingTable from "../client-billing/BillingTable";
import LienCalculator from "../calculator/LienCalculator";
import { clientsApi } from "@/lib/api/mongodb-api";
import { Client } from "@/types/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import ClientCaseInfo from "./client-specific/ClientCaseInfo";
import UpcomingCourtDates from "./client-specific/UpcomingCourtDates";
import ClientBillingInfo from "./client-specific/ClientBillingInfo";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardOverview = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser } = useAuth();

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

  // If user is a client, show specific client dashboard
  if (currentUser?.role === 'client') {
    return (
      <div className="space-y-6">
        <div className="space-y-2 pt-2">
          <h1 className="text-2xl font-bold tracking-tight">Welcome, {currentUser.name}</h1>
          <p className="text-muted-foreground">
            Here's the latest information about your case.
          </p>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : (
          <>
            <ClientCaseInfo clientId={currentUser.id} />
            <UpcomingCourtDates clientId={currentUser.id} />
            <ClientBillingInfo clientId={currentUser.id} />
          </>
        )}
      </div>
    );
  }

  // For admin/attorney users, show a more comprehensive dashboard
  return (
    <div className="space-y-8">
      <div className="space-y-3 pt-2">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Manage clients, cases, and access important information.
        </p>
      </div>

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
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
        </TabsList>
        <TabsContent value="billings">
          <BillingTable />
        </TabsContent>
        <TabsContent value="clients">
          <Card>
            <CardContent className="p-6">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-1/2" />
                  <Skeleton className="h-[200px] w-full" />
                </div>
              ) : clients.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Recent Clients</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clients.slice(0, 6).map((client) => (
                      <Card key={client.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="font-medium">{client.firstName} {client.lastName}</div>
                          <div className="text-sm text-muted-foreground mt-1">{client.phone || client.email}</div>
                          <div className="text-xs text-muted-foreground mt-2">Added: {new Date(client.createdAt).toLocaleDateString()}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No clients found. Add clients to get started.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Recent Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-center p-3 border rounded-md">
                      <FileText className="h-8 w-8 text-blue-500 mr-3" />
                      <div>
                        <div className="font-medium">Document Title {i}</div>
                        <div className="text-xs text-muted-foreground">Added: {new Date().toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="upcoming">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Upcoming Events</h3>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-md mr-3">
                          <Calendar className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <div className="font-medium">Client Meeting {i}</div>
                          <div className="text-xs text-muted-foreground">Case #{1000 + i}</div>
                        </div>
                      </div>
                      <div className="text-sm">
                        {new Date(Date.now() + i * 86400000).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardOverview;
