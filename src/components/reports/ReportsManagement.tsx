
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MedicalReportsSheet from "./MedicalReportsSheet";
import ReductionStatementsSheet from "./ReductionStatementsSheet";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

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
    <Card className="glass-card backdrop-blur-lg border border-white/20 rounded-lg shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 pb-8 border-b border-white/10">
        <CardTitle className="text-xl font-bold text-white">Reports Management System</CardTitle>
        <CardDescription className="text-white/70">
          Generate and manage medical reports and reduction statements
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="border-b border-white/10 px-6 py-2">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-transparent">
              <TabsTrigger 
                value="medical" 
                color="purple"
                className="data-[state=active]:bg-purple-500/20"
              >
                Medical Reports
              </TabsTrigger>
              <TabsTrigger 
                value="reduction" 
                color="cyan"
                className="data-[state=active]:bg-cyan-500/20"
              >
                Reduction Statements
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="medical" className="p-6 space-y-4">
            <Card className="border-purple-500/30 bg-purple-500/5 backdrop-blur-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-white">Medical Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <MedicalReportsSheet />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reduction" className="p-6 space-y-4">
            <Card className="border-cyan-500/30 bg-cyan-500/5 backdrop-blur-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-white">Reduction Statements</CardTitle>
              </CardHeader>
              <CardContent>
                <ReductionStatementsSheet />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReportsManagement;
