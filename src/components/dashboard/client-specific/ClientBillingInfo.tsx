
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface BillingEntry {
  id: string;
  description: string;
  hours: number;
  rate: number;
  date: string;
  attorney: string;
}

interface ClientBillingInfoProps {
  clientId: string;
}

// Mock data for billing information - in a real app, this would come from your API
const getMockBillingData = (clientId: string): BillingEntry[] => {
  return [
    {
      id: '1',
      description: 'Initial case review and strategy development',
      hours: 2.5,
      rate: 300,
      date: '2025-05-10',
      attorney: 'Jack Peters'
    },
    {
      id: '2',
      description: 'Document preparation for court filing',
      hours: 1.75,
      rate: 300,
      date: '2025-05-12',
      attorney: 'Jack Peters'
    },
    {
      id: '3',
      description: 'Client consultation and evidence review',
      hours: 1.0,
      rate: 300,
      date: '2025-05-15',
      attorney: 'Jack Peters'
    },
    {
      id: '4',
      description: 'Research on relevant case precedents',
      hours: 3.0,
      rate: 300,
      date: '2025-05-18',
      attorney: 'Jack Peters'
    }
  ];
};

const ClientBillingInfo: React.FC<ClientBillingInfoProps> = ({ clientId }) => {
  const [billingData, setBillingData] = useState<BillingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, this would be an API call
        // For now, we'll use mock data
        setTimeout(() => {
          const data = getMockBillingData(clientId);
          setBillingData(data);
          setLoading(false);
        }, 800);

      } catch (error) {
        console.error("Failed to fetch billing data:", error);
        toast({
          title: "Error",
          description: "Failed to load your billing information. Please try again later.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    if (clientId) {
      fetchBillingData();
    }
  }, [clientId, toast]);

  // Calculate totals
  const totalHours = billingData.reduce((sum, entry) => sum + entry.hours, 0);
  const totalAmount = billingData.reduce((sum, entry) => sum + (entry.hours * entry.rate), 0);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">Billing Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="shadow-none">
                <CardContent className="p-4 flex items-center">
                  <div className="bg-primary/10 p-2 rounded-md mr-4">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Total Billed Hours</p>
                    <p className="text-2xl font-semibold">{totalHours.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-none">
                <CardContent className="p-4 flex items-center">
                  <div className="bg-primary/10 p-2 rounded-md mr-4">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Total Charges</p>
                    <p className="text-2xl font-semibold">{formatCurrency(totalAmount)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-right">Hours</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {billingData.map((entry) => (
                    <tr key={entry.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-3">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <div>
                          <p>{entry.description}</p>
                          <p className="text-xs text-muted-foreground">{entry.attorney}</p>
                        </div>
                      </td>
                      <td className="p-3 text-right">{entry.hours.toFixed(2)}</td>
                      <td className="p-3 text-right">{formatCurrency(entry.hours * entry.rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientBillingInfo;
