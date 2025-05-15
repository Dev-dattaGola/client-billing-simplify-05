
import React, { useState } from 'react';
import { useMedical } from '@/contexts/MedicalContext';
import { Provider } from '@/types/medical';
import { Input } from '@/components/ui/input';
import { Search, Building2, Phone, Mail, MapPin, User, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const MedicalProvidersList = () => {
  const { providers, loading, refreshMedicalData } = useMedical();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.phone?.includes(searchTerm)
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search providers..."
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
          <p className="mt-2 text-muted-foreground">Loading providers...</p>
        </div>
      ) : filteredProviders.length === 0 ? (
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
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                      {provider.name}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">
                    {provider.type}
                  </TableCell>
                  <TableCell>
                    {provider.email && (
                      <div className="flex items-center mb-1">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        {provider.email}
                      </div>
                    )}
                    {provider.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        {provider.phone}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {provider.address ? (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        {provider.address}
                      </div>
                    ) : 'Not specified'}
                  </TableCell>
                  <TableCell>
                    {provider.contactPerson ? (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        {provider.contactPerson}
                      </div>
                    ) : 'Not specified'}
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

export default MedicalProvidersList;
