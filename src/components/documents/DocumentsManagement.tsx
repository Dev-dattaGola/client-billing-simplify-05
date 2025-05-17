
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
          <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10">
            <TabsTrigger value="insurance" className="text-white data-[state=active]:text-white data-[state=active]:bg-white/10">Insurance</TabsTrigger>
            <TabsTrigger value="bills" className="text-white data-[state=active]:text-white data-[state=active]:bg-white/10">Bills</TabsTrigger>
            {!isClient && (
              <>
                <TabsTrigger value="lop" className="text-white data-[state=active]:text-white data-[state=active]:bg-white/10">LOP</TabsTrigger>
                <TabsTrigger value="lor" className="text-white data-[state=active]:text-white data-[state=active]:bg-white/10">LOR</TabsTrigger>
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
