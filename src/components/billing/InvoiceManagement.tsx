
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Invoice } from '@/backend/billing-api';
import { billingApi } from '@/backend';
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Edit, Printer, Plus, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const InvoiceManagement: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [clientId, setClientId] = useState('');
  const [caseId, setCaseId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [invoiceItems, setInvoiceItems] = useState<{ description: string; amount: number; quantity: number }[]>([
    { description: '', amount: 0, quantity: 1 }
  ]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);
      try {
        const fetchedInvoices = await billingApi.getInvoices();
        setInvoices(fetchedInvoices);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        toast({
          title: "Error",
          description: "Failed to load invoices. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [toast]);

  const resetForm = () => {
    setClientId('');
    setCaseId('');
    setDueDate('');
    setInvoiceItems([{ description: '', amount: 0, quantity: 1 }]);
    setSelectedInvoice(null);
  };

  const handleAddItem = () => {
    setInvoiceItems([...invoiceItems, { description: '', amount: 0, quantity: 1 }]);
  };

  const handleItemChange = (index: number, field: 'description' | 'amount' | 'quantity', value: string | number) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setInvoiceItems(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    if (invoiceItems.length > 1) {
      const updatedItems = [...invoiceItems];
      updatedItems.splice(index, 1);
      setInvoiceItems(updatedItems);
    }
  };

  const calculateTotal = () => {
    return invoiceItems.reduce((total, item) => total + (item.amount * item.quantity), 0);
  };

  const handleCreateInvoice = async () => {
    if (!clientId || !caseId || !dueDate || invoiceItems.some(item => !item.description || item.amount <= 0)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const items = invoiceItems.map(item => ({
        id: Math.random().toString(36).substring(2, 11), // temporary ID for mock data
        description: item.description,
        amount: item.amount,
        quantity: item.quantity
      }));
      
      const total = calculateTotal();
      
      const newInvoice = await billingApi.createInvoice({
        clientId,
        caseId,
        amount: total,
        status: 'pending',
        dueDate: new Date(dueDate).toISOString(),
        items
      });
      
      setInvoices(prev => [...prev, newInvoice]);
      setIsDialogOpen(false);
      resetForm();
      
      toast({
        title: "Success",
        description: "Invoice created successfully.",
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to create invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      const updatedInvoice = await billingApi.markInvoiceAsPaid(id);
      if (updatedInvoice) {
        setInvoices(prev => prev.map(invoice => invoice.id === id ? updatedInvoice : invoice));
        toast({
          title: "Success",
          description: "Invoice marked as paid.",
        });
      }
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      toast({
        title: "Error",
        description: "Failed to update invoice status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Mock clients and cases for demo
  const mockClients = [
    { id: 'client1', name: 'John Client' },
    { id: 'client2', name: 'Sarah Patient' },
    { id: 'client3', name: 'Michael Case' },
  ];

  const mockCases = [
    { id: 'case1', name: 'Personal Injury - Car Accident' },
    { id: 'case2', name: 'Medical Malpractice Claim' },
    { id: 'case3', name: 'Workers Compensation Claim' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Invoice Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl glass-card backdrop-blur-lg border border-white/20 bg-white/5 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Invoice</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="client">Client</Label>
                  <Select value={clientId} onValueChange={setClientId}>
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClients.map(client => (
                        <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="case">Case</Label>
                  <Select value={caseId} onValueChange={setCaseId}>
                    <SelectTrigger id="case">
                      <SelectValue placeholder="Select case" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCases.map(caseItem => (
                        <SelectItem key={caseItem.id} value={caseItem.id}>{caseItem.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label>Invoice Items</Label>
                  <Button variant="outline" size="sm" onClick={handleAddItem}>
                    <Plus className="h-4 w-4 mr-1" /> Add Item
                  </Button>
                </div>
                <ScrollArea className="max-h-[300px]">
                  <Card>
                    <CardContent className="p-4">
                      {invoiceItems.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-end">
                          <div className="col-span-6">
                            <Label htmlFor={`item-${index}-desc`} className="text-xs mb-1">Description</Label>
                            <Input
                              id={`item-${index}-desc`}
                              value={item.description}
                              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                              placeholder="Service description"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label htmlFor={`item-${index}-qty`} className="text-xs mb-1">Qty</Label>
                            <Input
                              id={`item-${index}-qty`}
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                            />
                          </div>
                          <div className="col-span-3">
                            <Label htmlFor={`item-${index}-amount`} className="text-xs mb-1">Amount ($)</Label>
                            <Input
                              id={`item-${index}-amount`}
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.amount}
                              onChange={(e) => handleItemChange(index, 'amount', parseFloat(e.target.value))}
                            />
                          </div>
                          <div className="col-span-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(index)}
                              disabled={invoiceItems.length <= 1}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </ScrollArea>
                <div className="flex justify-end mt-2">
                  <div className="text-lg font-semibold">
                    Total: ${calculateTotal().toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm();
                setIsDialogOpen(false);
              }}>Cancel</Button>
              <Button onClick={handleCreateInvoice}>
                Create Invoice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-white/20 rounded-md bg-transparent backdrop-blur-sm">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-[250px] bg-white/10" />
                <Skeleton className="h-4 w-[400px] bg-white/10" />
              </div>
            ))}
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-white">Invoice ID</TableHead>
                  <TableHead className="text-white">Client</TableHead>
                  <TableHead className="text-white">Amount</TableHead>
                  <TableHead className="text-white">Due Date</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableCell colSpan={6} className="text-center text-white/70">
                      No invoices found. Create a new invoice to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map(invoice => (
                    <TableRow key={invoice.id} className="border-white/10 hover:bg-white/10">
                      <TableCell className="font-medium text-white">INV-{invoice.id.slice(0, 6).toUpperCase()}</TableCell>
                      <TableCell className="text-white">
                        {mockClients.find(c => c.id === invoice.clientId)?.name || invoice.clientId}
                      </TableCell>
                      <TableCell className="text-white">${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-white">{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={
                          invoice.status === 'paid' ? 'bg-green-500/30 text-green-200 hover:bg-green-500/40 border border-green-400/30' :
                          invoice.status === 'pending' ? 'bg-amber-500/30 text-amber-200 hover:bg-amber-500/40 border border-amber-400/30' :
                          invoice.status === 'overdue' ? 'bg-red-500/30 text-red-200 hover:bg-red-500/40 border border-red-400/30' :
                          'bg-gray-500/30 text-gray-200 hover:bg-gray-500/40 border border-gray-400/30'
                        }>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <Download className="h-4 w-4" />
                          </Button>
                          {invoice.status !== 'paid' && (
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => handleMarkAsPaid(invoice.id)}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default InvoiceManagement;
