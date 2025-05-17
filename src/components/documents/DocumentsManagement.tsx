
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InsuranceDocumentSheet from './InsuranceDocumentSheet';
import LopDocumentSheet from './LopDocumentSheet';
import LorDocumentSheet from './LorDocumentSheet';
import BillsSheet from './BillsSheet';
import { useAuth } from '@/contexts/AuthContext';

const DocumentsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('insurance');
  const { currentUser } = useAuth();
  
  const isClient = currentUser?.role === 'client';

  return (
    <Card className="glass-card backdrop-blur-lg border border-white/20">
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-transparent border border-white/10">
            <TabsTrigger 
              value="insurance" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-400 data-[state=active]:text-blue-300 data-[state=active]:bg-transparent text-white"
            >
              Insurance
            </TabsTrigger>
            <TabsTrigger 
              value="bills" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-teal-400 data-[state=active]:text-teal-300 data-[state=active]:bg-transparent text-white"
            >
              Bills
            </TabsTrigger>
            {!isClient && (
              <>
                <TabsTrigger 
                  value="lop" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-pink-400 data-[state=active]:text-pink-300 data-[state=active]:bg-transparent text-white"
                >
                  LOP
                </TabsTrigger>
                <TabsTrigger 
                  value="lor" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-400 data-[state=active]:text-indigo-300 data-[state=active]:bg-transparent text-white"
                >
                  LOR
                </TabsTrigger>
              </>
            )}
          </TabsList>
          <TabsContent value="insurance" className="mt-6 text-white">
            <InsuranceDocumentSheet />
          </TabsContent>
          <TabsContent value="bills" className="mt-6 text-white">
            <BillsSheet />
          </TabsContent>
          {!isClient && (
            <>
              <TabsContent value="lop" className="mt-6 text-white">
                <LopDocumentSheet />
              </TabsContent>
              <TabsContent value="lor" className="mt-6 text-white">
                <LorDocumentSheet />
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentsManagement;

