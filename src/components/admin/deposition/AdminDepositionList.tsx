
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { depositionsApi } from '@/lib/api/depositions-api';
import { Deposition, DepositionStatus } from '@/types/deposition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Search, Download, RefreshCw } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const statusColorMap: Record<DepositionStatus, string> = {
  'scheduled': 'bg-blue-100 text-blue-800',
  'completed': 'bg-green-100 text-green-800',
  'cancelled': 'bg-red-100 text-red-800',
  'rescheduled': 'bg-amber-100 text-amber-800'
};

const AdminDepositionList = () => {
  const [depositions, setDepositions] = useState<Deposition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<DepositionStatus | ''>('');
  const { toast } = useToast();

  const fetchDepositions = async () => {
    try {
      setLoading(true);
      const data = await depositionsApi.getDepositions();
      setDepositions(data);
    } catch (error) {
      console.error('Error fetching depositions:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load depositions. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepositions();
  }, []);

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      toast({
        title: 'Exporting data',
        description: 'Preparing your export...',
      });
      
      const url = await depositionsApi.exportDepositions(format);
      
      // Create a temporary link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `depositions-export-${new Date().toISOString().slice(0, 10)}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: 'Export complete',
        description: `Your data has been exported as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: 'Unable to export depositions data.',
      });
    }
  };

  const filterDepositions = () => {
    return depositions.filter(depo => {
      const matchesSearch = searchTerm 
        ? depo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          depo.attorneyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          depo.location?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      
      const matchesStatus = statusFilter
        ? depo.status === statusFilter
        : true;
      
      return matchesSearch && matchesStatus;
    });
  };

  const filteredDepositions = filterDepositions();

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">All Depositions</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search depositions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="w-full md:w-1/4">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as DepositionStatus | '')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="rescheduled">Rescheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 ml-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExport('csv')}
            >
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExport('json')}
            >
              <Download className="h-4 w-4 mr-1" />
              Export JSON
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchDepositions}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="py-12 text-center">
            <RefreshCw className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">Loading depositions...</p>
          </div>
        ) : filteredDepositions.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground opacity-30" />
            <h3 className="mt-2 text-lg font-medium">No depositions found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter ? 
                "Try changing your search filters." : 
                "No depositions have been created yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Attorney</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepositions.map((deposition) => (
                  <TableRow key={deposition.id}>
                    <TableCell className="font-medium">
                      {deposition.title}
                    </TableCell>
                    <TableCell>
                      {new Date(deposition.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>{deposition.attorneyName || 'Not assigned'}</TableCell>
                    <TableCell>{deposition.location || 'Not specified'}</TableCell>
                    <TableCell>
                      <Badge
                        className={statusColorMap[deposition.status]}
                      >
                        {deposition.status.charAt(0).toUpperCase() + deposition.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDepositionList;
