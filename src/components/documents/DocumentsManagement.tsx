
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
    <Card>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="bills">Bills</TabsTrigger>
            {!isClient && (
              <>
                <TabsTrigger value="lop">LOP</TabsTrigger>
                <TabsTrigger value="lor">LOR</TabsTrigger>
              </>
            )}
          </TabsList>
          <TabsContent value="insurance" className="mt-6">
            <InsuranceDocumentSheet />
          </TabsContent>
          <TabsContent value="bills" className="mt-6">
            <BillsSheet />
          </TabsContent>
          {!isClient && (
            <>
              <TabsContent value="lop" className="mt-6">
                <LopDocumentSheet />
              </TabsContent>
              <TabsContent value="lor" className="mt-6">
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
