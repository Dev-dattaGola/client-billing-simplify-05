
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Search, RefreshCw, Users, Receipt } from 'lucide-react';

// Mock data for attorney billing summary
const mockAttorneys = [
  {
    id: 'atty1',
    name: 'Sarah McCoy',
    email: 'sarah.mccoy@lawfirm.com',
    clientCount: 12,
    totalBilled: 28750.00,
    paidAmount: 21340.00,
    outstandingAmount: 7410.00
  },
  {
    id: 'atty2',
    name: 'Dan Lee',
    email: 'dan.lee@lawfirm.com',
    clientCount: 8,
    totalBilled: 19250.00,
    paidAmount: 15750.00,
    outstandingAmount: 3500.00
  },
  {
    id: 'atty3',
    name: 'Jessica Miller',
    email: 'jessica.miller@lawfirm.com',
    clientCount: 15,
    totalBilled: 32500.00,
    paidAmount: 29800.00,
    outstandingAmount: 2700.00
  }
];

// Mock data for client billing details
const mockClientBillings = [
  {
    id: 'bill1',
    clientId: 'c1',
    clientName: 'John Smith',
    attorneyId: 'atty1',
    attorneyName: 'Sarah McCoy',
    caseId: 'case1',
    caseTitle: 'Smith v. ABC Corp',
    billDate: '2025-03-15',
    amount: 2850.00,
    status: 'paid',
    paymentDate: '2025-03-25'
  },
  {
    id: 'bill2',
    clientId: 'c2',
    clientName: 'Maria Garcia',
    attorneyId: 'atty1',
    attorneyName: 'Sarah McCoy',
    caseId: 'case2',
    caseTitle: 'Garcia v. XYZ Inc',
    billDate: '2025-03-18',
    amount: 1950.00,
    status: 'pending',
    paymentDate: null
  },
  {
    id: 'bill3',
    clientId: 'c3',
    clientName: 'Robert Johnson',
    attorneyId: 'atty2',
    attorneyName: 'Dan Lee',
    caseId: 'case3',
    caseTitle: 'Johnson Medical Claim',
    billDate: '2025-03-10',
    amount: 3250.00,
    status: 'paid',
    paymentDate: '2025-03-20'
  },
  {
    id: 'bill4',
    clientId: 'c4',
    clientName: 'Sophia Chen',
    attorneyId: 'atty2',
    attorneyName: 'Dan Lee',
    caseId: 'case4',
    caseTitle: 'Chen Personal Injury',
    billDate: '2025-03-22',
    amount: 1750.00,
    status: 'overdue',
    paymentDate: null
  },
  {
    id: 'bill5',
    clientId: 'c5',
    clientName: 'James Williams',
    attorneyId: 'atty3',
    attorneyName: 'Jessica Miller',
    caseId: 'case5',
    caseTitle: 'Williams v. State',
    billDate: '2025-03-05',
    amount: 4200.00,
    status: 'paid',
    paymentDate: '2025-03-15'
  }
];

type AttorneyBilling = {
  id: string;
  name: string;
  email: string;
  clientCount: number;
  totalBilled: number;
  paidAmount: number;
  outstandingAmount: number;
};

type ClientBilling = {
  id: string;
  clientId: string;
  clientName: string;
  attorneyId: string;
  attorneyName: string;
  caseId: string;
  caseTitle: string;
  billDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentDate: string | null;
};

const AdminBillingView = () => {
  const [selectedAttorney, setSelectedAttorney] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [attorneyBillings, setAttorneyBillings] = useState<AttorneyBilling[]>(mockAttorneys);
  const [clientBillings, setClientBillings] = useState<ClientBilling[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Filter client billings based on selected attorney
    if (selectedAttorney) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const filtered = mockClientBillings.filter(
          bill => bill.attorneyId === selectedAttorney
        );
        setClientBillings(filtered);
        setLoading(false);
      }, 500);
    } else {
      setClientBillings([]);
    }
  }, [selectedAttorney]);

  const filteredAttorneyBillings = attorneyBillings.filter(attorney =>
    attorney.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attorney.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClientBillings = clientBillings.filter(bill =>
    bill.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.caseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleAttorneySelect = (attorneyId: string) => {
    setSelectedAttorney(attorneyId);
    if (attorneyId) {
      const attorney = attorneyBillings.find(a => a.id === attorneyId);
      toast({
        title: `Viewing ${attorney?.name}'s billings`,
        description: `Showing billing details for all clients assigned to ${attorney?.name}.`,
      });
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API refresh
    setTimeout(() => {
      setAttorneyBillings(mockAttorneys);
      if (selectedAttorney) {
        setClientBillings(mockClientBillings.filter(bill => bill.attorneyId === selectedAttorney));
      }
      setLoading(false);
      toast({
        title: 'Data refreshed',
        description: 'Billing information has been updated.',
      });
    }, 800);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold">Attorney Billing Overview</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search attorneys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>

          {loading && !selectedAttorney ? (
            <div className="py-12 text-center">
              <RefreshCw className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">Loading billing data...</p>
            </div>
          ) : filteredAttorneyBillings.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-10 w-10 mx-auto text-muted-foreground opacity-30" />
              <h3 className="mt-2 text-lg font-medium">No attorney billing data found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try changing your search term." : "No billing data is available."}
              </p>
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Attorney</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Client Count</TableHead>
                    <TableHead>Total Billed</TableHead>
                    <TableHead>Paid Amount</TableHead>
                    <TableHead>Outstanding</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttorneyBillings.map((attorney) => (
                    <TableRow key={attorney.id}>
                      <TableCell className="font-medium">{attorney.name}</TableCell>
                      <TableCell>{attorney.email}</TableCell>
                      <TableCell>{attorney.clientCount}</TableCell>
                      <TableCell>{formatCurrency(attorney.totalBilled)}</TableCell>
                      <TableCell>{formatCurrency(attorney.paidAmount)}</TableCell>
                      <TableCell>{formatCurrency(attorney.outstandingAmount)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAttorneySelect(attorney.id)}
                        >
                          View Clients
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedAttorney && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold">
                Client Billing Details -&nbsp;
                {attorneyBillings.find(a => a.id === selectedAttorney)?.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAttorney('')}
              >
                Back to Overview
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="py-12 text-center">
                <RefreshCw className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Loading client billing data...</p>
              </div>
            ) : filteredClientBillings.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="h-10 w-10 mx-auto text-muted-foreground opacity-30" />
                <h3 className="mt-2 text-lg font-medium">No client billing records found</h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "Try changing your search term."
                    : "This attorney doesn't have any client billing records yet."}
                </p>
              </div>
            ) : (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Case</TableHead>
                      <TableHead>Bill Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClientBillings.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">{bill.clientName}</TableCell>
                        <TableCell>{bill.caseTitle}</TableCell>
                        <TableCell>{formatDate(bill.billDate)}</TableCell>
                        <TableCell>{formatCurrency(bill.amount)}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              bill.status === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : bill.status === 'pending'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(bill.paymentDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminBillingView;
