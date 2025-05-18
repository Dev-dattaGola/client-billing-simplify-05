
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    <Card className="glass-card backdrop-blur-lg border border-white/20 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 pb-8 border-b border-white/10">
        <CardTitle className="text-xl font-bold text-white">Document Management System</CardTitle>
        <CardDescription className="text-white/70">
          Manage insurance documents, bills, LOPs, and letters of representation
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-transparent border border-white/10">
            <TabsTrigger 
              value="insurance" 
              color="blue"
              className="data-[state=active]:bg-blue-500/20"
            >
              Insurance
            </TabsTrigger>
            <TabsTrigger 
              value="bills" 
              color="teal"
              className="data-[state=active]:bg-teal-500/20"
            >
              Bills
            </TabsTrigger>
            {!isClient && (
              <>
                <TabsTrigger 
                  value="lop" 
                  color="pink"
                  className="data-[state=active]:bg-pink-500/20"
                >
                  LOP
                </TabsTrigger>
                <TabsTrigger 
                  value="lor" 
                  color="indigo"
                  className="data-[state=active]:bg-indigo-500/20"
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
