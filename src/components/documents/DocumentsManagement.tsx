
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LopDocumentSheet from "./LopDocumentSheet";
import LorDocumentSheet from "./LorDocumentSheet";
import InsuranceDocumentSheet from "./InsuranceDocumentSheet";
import BillsSheet from "./BillsSheet";
import { useAuth } from "@/contexts/AuthContext";

const DocumentsManagement = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const tabFromUrl = urlParams.get('tab') || 'insurance';
  const { currentUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  // Update active tab when URL changes
  useEffect(() => {
    if (currentUser?.role === 'client') {
      setActiveTab(urlParams.get('tab') === 'bills' ? 'bills' : 'insurance');
    } else {
      setActiveTab(urlParams.get('tab') || 'lop');
    }
  }, [location.search, currentUser?.role]);

  // For clients, only show Insurance and Bills tabs
  if (currentUser?.role === 'client') {
    return (
      <div className="bg-white rounded-lg border shadow-sm">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="border-b px-6 py-2 overflow-x-auto">
            <TabsList className="grid w-full max-w-xl grid-cols-2">
              <TabsTrigger value="insurance">Insurance</TabsTrigger>
              <TabsTrigger value="bills">Bills</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="insurance" className="p-6 space-y-4">
            <InsuranceDocumentSheet />
          </TabsContent>
          
          <TabsContent value="bills" className="p-6 space-y-4">
            <BillsSheet />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // For attorneys and admin, show all tabs
  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="border-b px-6 py-2 overflow-x-auto">
          <TabsList className="grid w-full max-w-xl grid-cols-4">
            <TabsTrigger value="lop">LOP</TabsTrigger>
            <TabsTrigger value="lor">LOR</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="bills">Bills</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="lop" className="p-6 space-y-4">
          <LopDocumentSheet />
        </TabsContent>
        
        <TabsContent value="lor" className="p-6 space-y-4">
          <LorDocumentSheet />
        </TabsContent>
        
        <TabsContent value="insurance" className="p-6 space-y-4">
          <InsuranceDocumentSheet />
        </TabsContent>
        
        <TabsContent value="bills" className="p-6 space-y-4">
          <BillsSheet />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentsManagement;
