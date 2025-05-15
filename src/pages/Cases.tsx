
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, Search, Plus, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const Cases = () => {
  const { currentUser } = useAuth();
  
  // Mock cases data - in a real app this would come from an API
  const cases = [
    { 
      id: 'CASE-001', 
      client: 'John Smith', 
      attorney: 'Sarah Johnson', 
      type: 'Personal Injury', 
      status: 'Active', 
      openDate: '2023-01-15',
      nextHearing: '2023-06-20'
    },
    { 
      id: 'CASE-002', 
      client: 'Mary Wilson', 
      attorney: 'Robert Lee', 
      type: 'Divorce', 
      status: 'Active', 
      openDate: '2023-02-05',
      nextHearing: '2023-07-10'
    },
    { 
      id: 'CASE-003', 
      client: 'Michael Brown', 
      attorney: 'Sarah Johnson', 
      type: 'Personal Injury', 
      status: 'Settled', 
      openDate: '2022-11-10',
      nextHearing: 'N/A'
    },
    { 
      id: 'CASE-004', 
      client: 'David Garcia', 
      attorney: 'Robert Lee', 
      type: 'Estate Planning', 
      status: 'Pending', 
      openDate: '2023-04-22',
      nextHearing: '2023-08-15'
    },
    { 
      id: 'CASE-005', 
      client: 'Linda Martinez', 
      attorney: 'Sarah Johnson', 
      type: 'Bankruptcy', 
      status: 'Active', 
      openDate: '2023-03-18',
      nextHearing: '2023-06-30'
    },
  ];

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Settled':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageLayout>
      <Helmet>
        <title>Cases - Lawerp500</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Case Management</h1>
            <p className="text-muted-foreground">
              View and manage all legal cases for your clients
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search cases..."
                className="w-full pl-8 md:w-[250px]"
              />
            </div>
            
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            
            {currentUser?.role === 'admin' && (
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>New Case</span>
              </Button>
            )}
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" /> Active Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Case ID</th>
                    <th className="text-left py-3 px-4 font-medium">Client</th>
                    <th className="text-left py-3 px-4 font-medium">Attorney</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Open Date</th>
                    <th className="text-left py-3 px-4 font-medium">Next Hearing</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((caseItem) => (
                    <tr key={caseItem.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{caseItem.id}</td>
                      <td className="py-3 px-4">{caseItem.client}</td>
                      <td className="py-3 px-4">{caseItem.attorney}</td>
                      <td className="py-3 px-4">{caseItem.type}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(caseItem.status)} variant="outline">
                          {caseItem.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{caseItem.openDate}</td>
                      <td className="py-3 px-4">{caseItem.nextHearing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Cases;
