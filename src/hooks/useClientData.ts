
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export interface ClientCase {
  id: string;
  title: string;
  caseNumber: string;
  status: string;
  description?: string;
  openDate: string;
  courtDate?: string;
  caseType: string;
}

export interface CourtDate {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  caseId: string;
  caseTitle: string;
}

export interface BillingInfo {
  totalHours: number;
  totalAmount: number;
  lastBilledDate: string;
  pendingAmount: number;
}

interface ClientDataResult {
  loading: boolean;
  clientCases: ClientCase[];
  courtDates: CourtDate[];
  billingInfo: BillingInfo | null;
}

export const useClientData = (): ClientDataResult => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [clientCases, setClientCases] = useState<ClientCase[]>([]);
  const [courtDates, setCourtDates] = useState<CourtDate[]>([]);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!currentUser?.id) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Get client profile for the current user
        const { data: profileData, error: profileError } = await supabase
          .from('clients')
          .select('id')
          .eq('user_id', currentUser.id)
          .single();

        if (profileError) {
          console.error("Error fetching client profile:", profileError);
          return;
        }

        if (!profileData?.id) {
          console.error("No client profile found for user");
          return;
        }

        const clientId = profileData.id;

        // Get client cases
        const { data: casesData, error: casesError } = await supabase
          .from('cases')
          .select('*')
          .eq('clientid', clientId);

        if (casesError) {
          console.error("Error fetching cases:", casesError);
        } else {
          const formattedCases = casesData?.map(c => ({
            id: c.id,
            title: c.title,
            caseNumber: c.casenumber,
            status: c.status,
            description: c.description,
            openDate: c.opendate,
            courtDate: c.courtdate,
            caseType: c.casetype
          })) || [];
          
          setClientCases(formattedCases);
        }

        // Get upcoming court dates
        // This would use a table join in a real implementation
        setCourtDates([]);

        // Get billing information
        // This would be from a billing table in a real implementation
        setBillingInfo({
          totalHours: 0,
          totalAmount: 0,
          lastBilledDate: new Date().toISOString(),
          pendingAmount: 0
        });

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
  }, [currentUser?.id, toast]);

  return { loading, clientCases, courtDates, billingInfo };
};
