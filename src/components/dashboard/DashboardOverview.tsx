
import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  BarChart3, 
  FileText, 
  ChevronDown,
  TrendingUp,
  Users, 
  MessageSquare,
  DollarSign,
  Bell
} from "lucide-react";
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
import { messagingApi } from "@/backend/messaging-api";

// Create a StatsCard component for metrics with proper TypeScript props
const StatsCard = ({ 
  icon: Icon, 
  title, 
  value, 
  trend, 
  color = "blue" 
}: { 
  icon: React.ElementType; 
  title: string; 
  value: string | number; 
  trend?: string; 
  color?: string;
}) => {
  return (
    <Card className="border border-white/20">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-sm text-white/70 mb-1">{title}</p>
          <div className="text-2xl font-bold text-white">{value}</div>
          {trend && (
            <div className="flex items-center mt-1 text-xs text-green-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              {trend}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-500/20`}>
          <Icon className={`h-5 w-5 text-${color}-400`} />
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardOverview = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  // Using useCallback to memoize the fetchData function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedClients = await clientsApi.getClients();
      const fetchedMessages = await messagingApi.getMessages();
      
      setClients(fetchedClients);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Use useEffect with proper dependency array
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Dependency on memoized fetchData function

  // Calculate stats using useMemo to prevent recalculation on every render
  const stats = useMemo(() => {
    return {
      totalClients: clients.length,
      activeClients: clients.filter(c => !c.isDropped).length,
      totalRevenue: "$37,842.50",
      monthlyRevenue: "$4,250.00",
      revenueGrowth: "+12.5% from last month",
      unreadMessages: messages.filter(m => !m.isRead).length,
      upcomingEvents: 5,
    };
  }, [clients, messages]);

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

  // For admin/attorney users, show enhanced dashboard
  return (
    <div className="space-y-8">
      <div className="space-y-3 pt-2">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your cases and clients.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          icon={Users} 
          title="Total Clients" 
          value={stats.totalClients} 
          trend="+3 this month"
          color="purple" 
        />
        <StatsCard 
          icon={DollarSign} 
          title="Monthly Revenue" 
          value={stats.monthlyRevenue}
          trend={stats.revenueGrowth}
          color="green" 
        />
        <StatsCard 
          icon={Calendar} 
          title="Upcoming Events" 
          value={stats.upcomingEvents}
          trend="Next: Tomorrow"
          color="amber" 
        />
        <StatsCard 
          icon={MessageSquare} 
          title="Unread Messages" 
          value={stats.unreadMessages}
          trend="2 new today"
          color="blue" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="border border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-semibold">Revenue Overview</CardTitle>
              <p className="text-sm text-white/70">Monthly breakdown</p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs flex gap-1">
              This Quarter <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[220px] w-full" />
            ) : (
              <div className="h-[220px] flex items-center justify-center">
                <div className="text-center text-white/70">
                  <BarChart3 className="h-16 w-16 mx-auto mb-2 opacity-50" />
                  <p>Revenue data visualization</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
              <p className="text-sm text-white/70">Latest updates</p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">View All</Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-md border border-white/10 bg-white/5">
                  <div className="bg-indigo-500/20 p-2 rounded-full">
                    <FileText className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New case document uploaded</p>
                    <p className="text-xs text-white/50">5 minutes ago • Case #1234</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-md border border-white/10 bg-white/5">
                  <div className="bg-green-500/20 p-2 rounded-full">
                    <DollarSign className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Settlement payment received</p>
                    <p className="text-xs text-white/50">2 hours ago • $12,500.00</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-md border border-white/10 bg-white/5">
                  <div className="bg-amber-500/20 p-2 rounded-full">
                    <Bell className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Court date scheduled</p>
                    <p className="text-xs text-white/50">Yesterday • Smith v. Johnson</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Third row with upcoming events and clients table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <Card className="border border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-semibold">Upcoming Events</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">View Calendar</Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-md hover:bg-white/5">
                    <div className="bg-purple-500/20 h-10 w-10 rounded-md flex items-center justify-center text-xs">
                      <div className="text-center">
                        <div className="font-bold text-purple-300">MAY</div>
                        <div className="text-white">{i + 20}</div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">Client Meeting #{i}</p>
                      <div className="flex items-center text-xs text-white/50">
                        <Clock className="h-3 w-3 mr-1" />
                        {10 + i}:00 AM
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full text-xs mt-2">
                  Show more events
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Clients */}
        <Card className="border border-white/20 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-semibold">Recent Clients</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">View All Clients</Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : clients.length > 0 ? (
              <div className="space-y-1">
                <div className="grid grid-cols-12 text-xs text-white/50 py-2 px-3">
                  <div className="col-span-4">NAME</div>
                  <div className="col-span-3">CASE TYPE</div>
                  <div className="col-span-3">STATUS</div>
                  <div className="col-span-2">DATE ADDED</div>
                </div>
                
                {clients.slice(0, 4).map((client, index) => (
                  <div 
                    key={client.id} 
                    className="grid grid-cols-12 py-2 px-3 rounded-md hover:bg-white/5"
                  >
                    <div className="col-span-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white mr-2">
                        {client.fullName?.substring(0, 2) || 'CL'}
                      </div>
                      <div className="truncate">{client.fullName}</div>
                    </div>
                    <div className="col-span-3 flex items-center text-white/70">
                      {['Personal Injury', 'Medical Malpractice', 'Car Accident', 'Workplace Injury'][index % 4]}
                    </div>
                    <div className="col-span-3 flex items-center">
                      <div className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300">
                        {['Active', 'In Progress', 'Pending', 'Review'][index % 4]}
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center text-white/50">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No clients found. Add clients to get started.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showCalculator && (
        <Card>
          <CardContent className="p-6">
            <LienCalculator />
          </CardContent>
        </Card>
      )}

      {/* Tab section */}
      <Tabs defaultValue="billings">
        <TabsList className="mb-4 bg-transparent">
          <TabsTrigger 
            value="billings" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-amber-400 data-[state=active]:text-amber-300 data-[state=active]:bg-transparent text-white"
          >
            Billings
          </TabsTrigger>
          <TabsTrigger 
            value="clients" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-400 data-[state=active]:text-blue-300 data-[state=active]:bg-transparent text-white"
          >
            Clients
          </TabsTrigger>
          <TabsTrigger 
            value="documents" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-400 data-[state=active]:text-indigo-300 data-[state=active]:bg-transparent text-white"
          >
            Documents
          </TabsTrigger>
          <TabsTrigger 
            value="upcoming" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-teal-400 data-[state=active]:text-teal-300 data-[state=active]:bg-transparent text-white"
          >
            Upcoming Events
          </TabsTrigger>
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
                  <h3 className="text-lg font-medium">All Clients</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clients.slice(0, 6).map((client) => (
                      <Card key={client.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="font-medium">{client.fullName}</div>
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
