
import { Case } from "@/types/case";
import { Client } from "@/types/client";
import CaseList from "./CaseList";

interface CaseTabContentProps {
  cases: Case[];
  clients: Client[];
  onSelectCase: (caseItem: Case) => void;
}

const CaseTabContent = ({ cases, clients, onSelectCase }: CaseTabContentProps) => {
  if (cases.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No cases found.</p>
      </div>
    );
  }

  return (
    <CaseList 
      cases={cases}
      clients={clients} 
      onSelectCase={onSelectCase}
    />
  );
};

export default CaseTabContent;
