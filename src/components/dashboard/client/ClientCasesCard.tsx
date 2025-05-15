
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { format } from "date-fns";

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

interface ClientCasesCardProps {
  loading: boolean;
  clientCases: ClientCase[];
}

export const ClientCasesCard: React.FC<ClientCasesCardProps> = ({ loading, clientCases }) => {
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
  );
};
