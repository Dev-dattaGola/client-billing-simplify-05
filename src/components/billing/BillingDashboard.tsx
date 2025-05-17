
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InvoiceManagement from './InvoiceManagement';
import SettlementsManagement from './SettlementsManagement';
import LettersManagement from './LettersManagement';
import ReductionStatementsSheet from '../reports/ReductionStatementsSheet';
import { DollarSign, FileText, Scale, PlusCircle, ArrowDownIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const BillingDashboard = () => {
  const [activeTab, setActiveTab] = useState('invoices');
  const { toast } = useToast();

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-lawfirm-dark-purple">Billing & Settlements</h1>
          <p className="text-lawfirm-neutral-gray mt-1">Track invoices, manage settlements, generate payment letters, and handle reduction statements</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-md hover:from-amber-600 hover:to-orange-700 transition-all shadow-md"
            onClick={() => toast({
              title: "Coming Soon",
              description: "Invoice creation will be available in the next update.",
            })}
          >
            <PlusCircle className="h-5 w-5" />
            <span>New Invoice</span>
          </button>
        </div>
      </div>
      
      <Card className="border-none shadow-lg bg-white overflow-hidden rounded-xl">
        <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100 pb-8 border-b border-amber-200">
          <CardTitle className="flex items-center gap-2 text-2xl text-amber-800">
            <DollarSign className="h-6 w-6 text-amber-600" />
            Financial Management
          </CardTitle>
          <CardDescription className="text-amber-700/80">
            Comprehensive tools to manage billing, settlements, and financial documents
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-200">
              <div className="px-6">
                <TabsList className="h-14 w-full bg-transparent justify-start gap-8 mb-[-1px]">
                  <TabsTrigger 
                    value="invoices" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-amber-500 data-[state=active]:text-amber-700 data-[state=active]:bg-transparent rounded-none h-14 px-4 py-2 font-medium transition-all"
                  >
                    <DollarSign className="mr-2 h-5 w-5" />
                    <span>Invoices</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settlements" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-amber-500 data-[state=active]:text-amber-700 data-[state=active]:bg-transparent rounded-none h-14 px-4 py-2 font-medium transition-all"
                  >
                    <Scale className="mr-2 h-5 w-5" />
                    <span>Settlements</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="letters" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-amber-500 data-[state=active]:text-amber-700 data-[state=active]:bg-transparent rounded-none h-14 px-4 py-2 font-medium transition-all"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    <span>Letters</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reductions" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-amber-500 data-[state=active]:text-amber-700 data-[state=active]:bg-transparent rounded-none h-14 px-4 py-2 font-medium transition-all"
                  >
                    <ArrowDownIcon className="mr-2 h-5 w-5" />
                    <span>Reduction Statements</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <div>
              <TabsContent value="invoices" className="m-0 p-6">
                <InvoiceManagement />
              </TabsContent>
              
              <TabsContent value="settlements" className="m-0 p-6">
                <SettlementsManagement />
              </TabsContent>
              
              <TabsContent value="letters" className="m-0 p-6">
                <LettersManagement />
              </TabsContent>

              <TabsContent value="reductions" className="m-0 p-6">
                <ReductionStatementsSheet />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingDashboard;
