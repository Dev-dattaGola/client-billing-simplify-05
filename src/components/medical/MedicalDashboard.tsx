
import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProviderManagement from './ProviderManagement';
import MedicalRecordsManagement from './MedicalRecordsManagement';
import MedicalReportsSheet from '../reports/MedicalReportsSheet';
import { useToast } from "@/hooks/use-toast";
import { Stethoscope, FileHeart, PlusCircle, FileText } from 'lucide-react';

const MedicalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('providers');
  const { toast } = useToast();
  
  // Use useCallback to prevent recreation of this function on each render
  const handleAddProvider = useCallback(() => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available in the next update.",
    });
  }, [toast]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Medical Management</h1>
          <p className="text-white/70 mt-1">Track healthcare providers, medical records, and reports for your cases</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-md hover:from-green-600 hover:to-emerald-700 transition-all shadow-md button-glass"
            onClick={handleAddProvider}
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add Provider</span>
          </button>
        </div>
      </div>
      
      <Card className="glass-card backdrop-blur-lg border border-white/20 shadow-lg overflow-hidden rounded-xl">
        <CardHeader className="bg-gradient-to-r from-green-500/20 to-teal-500/20 pb-8 border-b border-white/10">
          <CardTitle className="flex items-center gap-2 text-2xl text-white">
            <FileHeart className="h-6 w-6 text-green-400" />
            Medical Record System
          </CardTitle>
          <CardDescription className="text-white/70">
            Centralized management of healthcare providers, patient medical records, and reports
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-white/10">
              <div className="px-6">
                <TabsList className="h-14 w-full bg-transparent justify-start gap-8 mb-[-1px]">
                  <TabsTrigger 
                    value="providers" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-green-400 data-[state=active]:text-green-400 data-[state=active]:bg-transparent rounded-none h-14 px-4 py-2 font-medium transition-all text-white"
                  >
                    <Stethoscope className="mr-2 h-5 w-5" />
                    <span>Healthcare Providers</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="records" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-green-400 data-[state=active]:text-green-400 data-[state=active]:bg-transparent rounded-none h-14 px-4 py-2 font-medium transition-all text-white"
                  >
                    <FileHeart className="mr-2 h-5 w-5" />
                    <span>Medical Records</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reports" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-green-400 data-[state=active]:text-green-400 data-[state=active]:bg-transparent rounded-none h-14 px-4 py-2 font-medium transition-all text-white"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    <span>Medical Reports</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <div className="glass-card backdrop-blur-lg">
              <TabsContent value="providers" className="m-0 p-6">
                <ProviderManagement />
              </TabsContent>
              
              <TabsContent value="records" className="m-0 p-6">
                <MedicalRecordsManagement />
              </TabsContent>

              <TabsContent value="reports" className="m-0 p-6">
                <MedicalReportsSheet />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(MedicalDashboard);
