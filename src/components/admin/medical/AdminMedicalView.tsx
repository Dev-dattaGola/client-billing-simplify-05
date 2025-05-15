
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { medicalApi } from '@/backend/medical-api';
import { Provider, MedicalRecord } from '@/types/medical';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, RefreshCw, Building2 } from 'lucide-react';

const AdminMedicalView = () => {
  const [activeTab, setActiveTab] = useState<string>('providers');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === 'providers') {
          const providersData = await medicalApi.getProviders();
          setProviders(providersData);
        } else {
          const recordsData = await medicalApi.getMedicalRecords();
          setMedicalRecords(recordsData);
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Failed to load ${activeTab}. Please try again.`,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, toast]);

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.phone?.includes(searchTerm)
  );

  const filteredRecords = medicalRecords.filter(record =>
    record.providerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.recordType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Medical Records Management</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <TabsList>
              <TabsTrigger value="providers">Providers</TabsTrigger>
              <TabsTrigger value="records">Medical Records</TabsTrigger>
            </TabsList>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <RefreshCw className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">Loading {activeTab}...</p>
            </div>
          ) : (
            <>
              <TabsContent value="providers" className="m-0">
                {filteredProviders.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="h-10 w-10 mx-auto text-muted-foreground opacity-30" />
                    <h3 className="mt-2 text-lg font-medium">No providers found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? "Try changing your search term." : "No providers have been added yet."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Provider Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Contact Info</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Contact Person</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProviders.map((provider) => (
                          <TableRow key={provider.id}>
                            <TableCell className="font-medium">{provider.name}</TableCell>
                            <TableCell className="capitalize">{provider.type}</TableCell>
                            <TableCell>
                              {provider.email && <div>{provider.email}</div>}
                              {provider.phone && <div>{provider.phone}</div>}
                            </TableCell>
                            <TableCell>{provider.address || 'Not specified'}</TableCell>
                            <TableCell>{provider.contactPerson || 'Not specified'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="records" className="m-0">
                {filteredRecords.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="h-10 w-10 mx-auto text-muted-foreground opacity-30" />
                    <h3 className="mt-2 text-lg font-medium">No medical records found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? "Try changing your search term." : "No medical records have been added yet."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Provider</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.title}</TableCell>
                            <TableCell>{record.providerName || 'Unknown'}</TableCell>
                            <TableCell className="capitalize">{record.recordType}</TableCell>
                            <TableCell>
                              {new Date(record.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </TableCell>
                            <TableCell>{formatCurrency(record.amount)}</TableCell>
                            <TableCell>
                              {record.paid ? (
                                <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                  Paid ({record.paidBy || 'unknown'})
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                                  Unpaid
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminMedicalView;
