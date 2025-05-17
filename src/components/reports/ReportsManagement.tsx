
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MedicalReportsSheet from "./MedicalReportsSheet";
import ReductionStatementsSheet from "./ReductionStatementsSheet";

const ReportsManagement = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const tabFromUrl = urlParams.get('tab') || 'medical';
  
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  return (
    <div className="glass-card backdrop-blur-lg border border-white/20 rounded-lg shadow-sm">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="border-b border-white/10 px-6 py-2">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-transparent">
            <TabsTrigger 
              value="medical" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-purple-400 data-[state=active]:text-purple-300 data-[state=active]:bg-transparent text-white"
            >
              Medical Reports
            </TabsTrigger>
            <TabsTrigger 
              value="reduction" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-cyan-400 data-[state=active]:text-cyan-300 data-[state=active]:bg-transparent text-white"
            >
              Reduction Statements
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="medical" className="p-6 space-y-4">
          <MedicalReportsSheet />
        </TabsContent>
        
        <TabsContent value="reduction" className="p-6 space-y-4">
          <ReductionStatementsSheet />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsManagement;

