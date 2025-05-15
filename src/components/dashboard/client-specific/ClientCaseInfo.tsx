
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { casesApi } from "@/lib/api/mongodb-api";
import { Case } from "@/types/case";
import { useToast } from "@/hooks/use-toast";

interface ClientCaseInfoProps {
  clientId: string;
}

const ClientCaseInfo: React.FC<ClientCaseInfoProps> = ({ clientId }) => {
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        setLoading(true);
        const cases = await casesApi.getCasesByClientId(clientId);
        
        if (cases && cases.length > 0) {
          setCaseData(cases[0]); // Get the first case for now
        }
      } catch (error) {
        console.error("Failed to fetch case data:", error);
        toast({
          title: "Error",
          description: "Failed to load your case information. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchCaseData();
    }
  }, [clientId, toast]);

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'settled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">Your Case Information</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ) : caseData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Case Number</p>
                <p className="text-lg font-semibold">{caseData.caseNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="flex items-center">
                  <Badge className={getBadgeColor(caseData.status)}>
                    {caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Case Type</p>
              <p>{caseData.caseType}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Case Description</p>
              <p className="text-sm">{caseData.description || "No description available."}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Date</p>
                <p>{new Date(caseData.openDate).toLocaleDateString()}</p>
              </div>
              {caseData.closeDate && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Close Date</p>
                  <p>{new Date(caseData.closeDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            
            {caseData.statueOfLimitations && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Statue of Limitations</p>
                <p>{new Date(caseData.statueOfLimitations).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            <p>No case information available.</p>
            <p className="text-sm mt-1">Please contact your attorney for details.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientCaseInfo;
