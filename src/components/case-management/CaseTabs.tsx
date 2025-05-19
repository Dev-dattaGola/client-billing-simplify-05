
import { useMemo, memo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Case } from "@/types/case";
import { Client } from "@/types/client";
import CaseTabContent from "./CaseTabContent";

interface CaseTabsProps {
  cases: Case[];
  clients: Client[];
  searchQuery: string;
  onSelectCase: (caseItem: Case) => void;
}

const CaseTabs = ({ cases, clients, searchQuery, onSelectCase }: CaseTabsProps) => {
  // Memoize filtered cases to avoid recalculating on every render
  const filteredCases = useMemo(() => {
    console.log("Filtering cases with search query:", searchQuery);
    return cases.filter(
      (caseItem) =>
        caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [cases, searchQuery]);

  // Pre-filter cases by status to avoid unnecessary recalculations
  const openCases = useMemo(() => filteredCases.filter(c => c.status === 'open'), [filteredCases]);
  const pendingCases = useMemo(() => filteredCases.filter(c => c.status === 'pending'), [filteredCases]);
  const closedCases = useMemo(() => filteredCases.filter(c => c.status === 'closed' || c.status === 'settled'), [filteredCases]);

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-4">
        <TabsTrigger value="all">All Cases</TabsTrigger>
        <TabsTrigger value="open">Open</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="closed">Closed</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <CaseTabContent 
          cases={filteredCases}
          clients={clients} 
          onSelectCase={onSelectCase}
        />
      </TabsContent>
      
      <TabsContent value="open">
        <CaseTabContent 
          cases={openCases}
          clients={clients} 
          onSelectCase={onSelectCase}
        />
      </TabsContent>
      
      <TabsContent value="pending">
        <CaseTabContent 
          cases={pendingCases}
          clients={clients} 
          onSelectCase={onSelectCase}
        />
      </TabsContent>
      
      <TabsContent value="closed">
        <CaseTabContent 
          cases={closedCases}
          clients={clients} 
          onSelectCase={onSelectCase}
        />
      </TabsContent>
    </Tabs>
  );
};

// Memoize the entire component to prevent unnecessary renders
export default memo(CaseTabs);
