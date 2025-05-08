
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Case } from "@/types/case";
import { Client } from "@/types/client";
import { format } from "date-fns";

interface CaseListProps {
  cases: Case[];
  clients: Client[];
  onSelectCase: (caseItem: Case) => void;
}

const CaseList = ({ cases, clients, onSelectCase }: CaseListProps) => {
  // Helper function to get client name
  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.fullName : "Unknown Client";
  };

  // Helper function to get badge variant based on status
  const getBadgeVariant = (status: string) => {
    switch(status) {
      case 'open':
        return 'default';
      case 'closed':
        return 'secondary';
      case 'settled':
        return 'outline';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (cases.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No cases found.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {cases.map((caseItem) => (
        <Card
          key={caseItem.id}
          className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => onSelectCase(caseItem)}
        >
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{caseItem.title}</h3>
                <Badge variant={getBadgeVariant(caseItem.status)}>
                  {caseItem.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Case #{caseItem.caseNumber} | {getClientName(caseItem.clientId)}
              </div>
              {caseItem.description && (
                <p className="text-sm text-muted-foreground">
                  {caseItem.description.length > 150
                    ? `${caseItem.description.substring(0, 150)}...`
                    : caseItem.description}
                </p>
              )}
            </div>
            <div className="shrink-0 text-sm text-muted-foreground md:text-right">
              <div>Opened: {format(new Date(caseItem.openDate), "MMM d, yyyy")}</div>
              {caseItem.courtDate && (
                <div>Court Date: {format(new Date(caseItem.courtDate), "MMM d, yyyy")}</div>
              )}
              {caseItem.statueOfLimitations && (
                <div>SOL: {format(new Date(caseItem.statueOfLimitations), "MMM d, yyyy")}</div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CaseList;
