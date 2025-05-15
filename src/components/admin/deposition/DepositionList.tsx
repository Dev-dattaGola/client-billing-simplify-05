
import React, { useState, useEffect } from 'react';
import { useDepositions } from '@/contexts/DepositionContext';
import { Deposition, DepositionStatus } from '@/types/deposition';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, FileText, Search, Calendar, MapPin, User } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statusColorMap: Record<DepositionStatus, string> = {
  'scheduled': 'bg-blue-100 text-blue-800',
  'completed': 'bg-green-100 text-green-800',
  'cancelled': 'bg-red-100 text-red-800',
  'rescheduled': 'bg-amber-100 text-amber-800'
};

const DepositionList = () => {
  const { depositions, loading, refreshDepositions, filterDepositions } = useDepositions();
  const [filteredDepositions, setFilteredDepositions] = useState<Deposition[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<DepositionStatus | ''>('');
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  useEffect(() => {
    setFilteredDepositions(depositions);
  }, [depositions]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    applyFilters(e.target.value, statusFilter);
  };

  const handleStatusFilter = (value: DepositionStatus | '') => {
    setStatusFilter(value);
    applyFilters(searchTerm, value);
  };

  const applyFilters = async (search: string, status: DepositionStatus | '') => {
    setIsFiltering(true);
    try {
      const filtered = await filterDepositions({
        search: search || undefined,
        status: status || undefined
      });
      setFilteredDepositions(filtered);
    } finally {
      setIsFiltering(false);
    }
  };

  const handleRefresh = () => {
    refreshDepositions();
    setSearchTerm('');
    setStatusFilter('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search depositions..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-8"
          />
        </div>
        
        <div className="w-full md:w-1/4">
          <Select
            value={statusFilter}
            onValueChange={(value) => handleStatusFilter(value as DepositionStatus | '')}
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
        
        <div className="ml-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading || isFiltering}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading || isFiltering ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {loading || isFiltering ? (
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
                <TableHead>Date & Time</TableHead>
                <TableHead>Attorney</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepositions.map((deposition) => (
                <TableRow key={deposition.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                      <span className="truncate">{deposition.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                      {formatDate(deposition.date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                      {deposition.attorneyName || 'Not assigned'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                      {deposition.location || 'Not specified'}
                    </div>
                  </TableCell>
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
    </div>
  );
};

export default DepositionList;
