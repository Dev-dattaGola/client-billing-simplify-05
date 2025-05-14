
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/frontend/components/layout/PageLayout';
import { useClient } from '@/contexts/ClientContext';
import { Client } from '@/types/client';
import { FileDown, Search, RefreshCw, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { clientsApi } from '@/lib/api/client-api';

const DroppedClients = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [droppedClients, setDroppedClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchDroppedClients = async () => {
      try {
        setLoading(true);
        const clients = await clientsApi.getDroppedClients();
        setDroppedClients(clients);
        setFilteredClients(clients);
      } catch (error) {
        console.error("Failed to fetch dropped clients:", error);
        toast.error("Failed to load dropped clients data");
      } finally {
        setLoading(false);
      }
    };

    fetchDroppedClients();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClients(droppedClients);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = droppedClients.filter(
        client =>
          client.fullName.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query) ||
          client.phone.includes(query) ||
          (client.accountNumber && client.accountNumber.toLowerCase().includes(query))
      );
      setFilteredClients(filtered);
    }
  }, [searchQuery, droppedClients]);

  const handleExportClients = async () => {
    // Simulate export functionality
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Dropped client data exported successfully');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const clients = await clientsApi.getDroppedClients();
      setDroppedClients(clients);
      setFilteredClients(clients);
      toast.success('Dropped client data refreshed');
    } catch (error) {
      console.error("Failed to refresh dropped clients:", error);
      toast.error("Failed to refresh dropped clients data");
    } finally {
      setLoading(false);
    }
  };

  const openClientDetails = (client: Client) => {
    setSelectedClient(client);
    setIsDetailsOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <PageLayout>
      <Helmet>
        <title>Dropped Clients - LAW ERP 500</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dropped Clients</h1>
            <p className="text-muted-foreground mt-1">
              View all clients that have been dropped from the firm
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 md:w-[200px] lg:w-[300px]"
              />
            </form>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportClients}
            >
              <FileDown className="h-4 w-4 mr-1" /> Export
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Dropped Client List</CardTitle>
            <CardDescription>
              All clients who have been dropped from the firm
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Account #</TableHead>
                      <TableHead>Date Dropped</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No dropped clients found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">{client.fullName}</TableCell>
                          <TableCell>
                            <div>
                              <div>{client.email}</div>
                              <div className="text-xs text-muted-foreground">{client.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>{client.accountNumber || 'N/A'}</TableCell>
                          <TableCell>{formatDate(client.droppedDate)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openClientDetails(client)}
                            >
                              <Info className="h-4 w-4 mr-1" /> Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dropped Client Details</DialogTitle>
            <DialogDescription>
              Information about why the client was dropped
            </DialogDescription>
          </DialogHeader>

          {selectedClient && (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <h3 className="font-medium">Client Information</h3>
                <p className="text-sm">{selectedClient.fullName}</p>
                <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
                <p className="text-sm text-muted-foreground">{selectedClient.phone}</p>
              </div>

              <div className="space-y-1">
                <h3 className="font-medium">Date Dropped</h3>
                <p className="text-sm">{formatDate(selectedClient.droppedDate)}</p>
              </div>

              <div className="space-y-1">
                <h3 className="font-medium">Reason for Dropping</h3>
                <p className="text-sm whitespace-pre-line">{selectedClient.droppedReason || 'No reason provided'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <footer className="px-4 py-6 border-t text-sm text-muted-foreground">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">LAW ERP 500</span> | Dropped Clients
          </div>
          <div className="text-sm">© 2023-2025 All rights reserved.</div>
        </div>
      </footer>
    </PageLayout>
  );
};

export default DroppedClients;
