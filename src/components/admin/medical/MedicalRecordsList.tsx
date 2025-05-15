
import React, { useState } from 'react';
import { useMedical } from '@/contexts/MedicalContext';
import { MedicalRecord } from '@/types/medical';
import { Input } from '@/components/ui/input';
import { Search, FileText, Calendar, Building2, Receipt, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const MedicalRecordsList = () => {
  const { medicalRecords, loading, refreshMedicalData } = useMedical();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredRecords = medicalRecords.filter(record =>
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.providerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.recordType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search medical records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="ml-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshMedicalData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="py-12 text-center">
          <RefreshCw className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Loading medical records...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="h-10 w-10 mx-auto text-muted-foreground opacity-30" />
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
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      {record.title}
                    </div>
                    {record.description && (
                      <div className="text-xs text-muted-foreground mt-1">{record.description}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                      {record.providerName || 'Unknown'}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">
                    {record.recordType}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {formatDate(record.date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Receipt className="h-4 w-4 mr-2 text-muted-foreground" />
                      {formatCurrency(record.amount)}
                    </div>
                  </TableCell>
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
    </div>
  );
};

export default MedicalRecordsList;
