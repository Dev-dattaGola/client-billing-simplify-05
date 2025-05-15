import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarClock, FileText, DollarSign, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ClientCase {
  id: string;
  title: string;
  caseNumber: string;
  status: string;
  description?: string;
  openDate: string;
  courtDate?: string;
  caseType: string;
}

interface CourtDate {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  caseId: string;
  caseTitle?: string;
}

interface BillingInfo {
  totalHours: number;
  totalAmount: number;
  lastBilledDate: string;
  pendingAmount: number;
}

const ClientDashboard = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [clientCases, setClientCases] = useState<ClientCase[]>([]);
  const [courtDates, setCourtDates] = useState<CourtDate[]>([]);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!currentUser?.id) return;
      
      setLoading(true);
      try {
        // Get client ID from profiles table using currentUser.id
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', currentUser.id)
          .single();

        if (profileError) throw profileError;

        // Get client data using profile ID
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('id')
          .eq('user_id', profileData.id)
          .single();

        if (clientError) throw clientError;

        // Get client cases
        const { data: casesData, error: casesError } = await supabase
          .rpc('get_cases_by_client_id', { client_id: clientData.id });

        if (casesError) {
          console.error("Error fetching cases:", casesError);
          setClientCases([]);
        } else {
          // Safe type casting
          const typedCasesData = casesData as ClientCase[];
          setClientCases(typedCasesData || []);
        }

        // Get upcoming court dates
        const { data: datesData, error: datesError } = await supabase
          .rpc('get_court_dates_by_client_id', { client_id: clientData.id });

        if (datesError) {
          console.error("Error fetching court dates:", datesError);
          setCourtDates([]);
        } else {
          // Safe type casting
          const typedDatesData = datesData as CourtDate[];
          setCourtDates(typedDatesData || []);
        }

        // Get billing information
        const { data: billingData, error: billingError } = await supabase
          .rpc('get_billing_summary_by_client_id', { client_id: clientData.id });

        if (billingError) {
          console.error("Error fetching billing info:", billingError);
          setBillingInfo({
            totalHours: 0,
            totalAmount: 0,
            lastBilledDate: new Date().toISOString(),
            pendingAmount: 0
          });
        } else {
          // Type safely and check if we have data
          const typedBillingData = billingData as BillingInfo[];
          if (typedBillingData && typedBillingData.length > 0) {
            setBillingInfo(typedBillingData[0]);
          } else {
            setBillingInfo({
              totalHours: 0,
              totalAmount: 0,
              lastBilledDate: new Date().toISOString(),
              pendingAmount: 0
            });
          }
        }

      } catch (error: any) {
        console.error('Error fetching client data:', error);
        toast({
          title: "Error loading data",
          description: "Unable to load your dashboard information. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [currentUser, toast]);

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'settled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Your Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back. Here's an overview of your cases and upcoming activities.
        </p>
      </div>

      {/* Case Information Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Your Cases
          </CardTitle>
          <CardDescription>
            Current status and information about your legal cases
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : clientCases.length > 0 ? (
            <div className="space-y-4">
              {clientCases.map((caseItem) => (
                <div key={caseItem.id} className="flex flex-col sm:flex-row justify-between border-b pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{caseItem.title}</h3>
                      <Badge className={getStatusColor(caseItem.status)}>{caseItem.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Case #{caseItem.caseNumber}</p>
                    <p className="text-sm mt-1">{caseItem.description || "No description available."}</p>
                  </div>
                  <div className="text-sm text-right mt-2 sm:mt-0">
                    <div>Opened: {format(new Date(caseItem.openDate), 'MMM d, yyyy')}</div>
                    {caseItem.courtDate && (
                      <div>Court Date: {format(new Date(caseItem.courtDate), 'MMM d, yyyy')}</div>
                    )}
                    <div className="capitalize">Type: {caseItem.caseType.replace(/-/g, ' ')}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No active cases found.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Court Dates Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <CalendarClock className="mr-2 h-5 w-5" />
            Upcoming Court Dates
          </CardTitle>
          <CardDescription>
            Your scheduled court appearances and deadlines
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : courtDates.length > 0 ? (
            <div className="space-y-4">
              {courtDates.map((date) => (
                <div key={date.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-semibold">{date.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {date.caseTitle ? `Case: ${date.caseTitle}` : 'No case specified'}
                    </p>
                    <p className="text-sm mt-1">{date.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{format(new Date(date.date), 'MMM d, yyyy')}</div>
                    <div className="text-sm">{date.time}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming court dates scheduled.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing Information Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Billing Information
          </CardTitle>
          <CardDescription>
            Summary of your billable hours and charges
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
            </div>
          ) : billingInfo ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{billingInfo.totalHours.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    As of {format(new Date(billingInfo.lastBilledDate), 'MMM d, yyyy')}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${billingInfo.totalAmount.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Lifetime billing amount
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold">${billingInfo.pendingAmount.toFixed(2)}</div>
                  {billingInfo.pendingAmount > 0 && (
                    <div className="absolute top-2 right-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {billingInfo.pendingAmount > 0 ? 'Payment required' : 'No pending payments'}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No billing information available.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;
