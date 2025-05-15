
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ClientCase } from "@/components/dashboard/client/ClientCasesCard";
import { CourtDate } from "@/components/dashboard/client/ClientCourtDatesCard";
import { BillingInfo } from "@/components/dashboard/client/ClientBillingCard";

interface UseClientDataProps {
  userId: string | undefined;
}

interface ClientDataResult {
  loading: boolean;
  clientCases: ClientCase[];
  courtDates: CourtDate[];
  billingInfo: BillingInfo | null;
}

// Define input types for RPC functions
interface ClientIdParam {
  client_id: string;
}

export const useClientData = ({ userId }: UseClientDataProps): ClientDataResult => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [clientCases, setClientCases] = useState<ClientCase[]>([]);
  const [courtDates, setCourtDates] = useState<CourtDate[]>([]);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        // Get client ID from profiles table using userId
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
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
          setClientCases(casesData as ClientCase[] || []);
        }

        // Get upcoming court dates
        const { data: datesData, error: datesError } = await supabase
          .rpc('get_court_dates_by_client_id', { client_id: clientData.id });

        if (datesError) {
          console.error("Error fetching court dates:", datesError);
          setCourtDates([]);
        } else {
          setCourtDates(datesData as CourtDate[] || []);
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
          if (billingData && Array.isArray(billingData) && billingData.length > 0) {
            setBillingInfo(billingData[0] as BillingInfo);
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
  }, [userId, toast]);

  return { loading, clientCases, courtDates, billingInfo };
};
