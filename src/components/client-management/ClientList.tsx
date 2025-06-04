
import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Edit, Trash2, UserX } from 'lucide-react';
import { Client, ClientFilterParams } from '@/types/client';

interface ClientListProps {
  clients: Client[];
  onViewClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
  onDeleteClient?: (clientId: string) => void;
  onDropClient: (clientId: string, reason: string) => void;
  searchQuery?: string;
  filters?: ClientFilterParams;
  loading?: boolean;
}

const ClientList: React.FC<ClientListProps> = ({
  clients,
  onViewClient,
  onEditClient,
  onDeleteClient,
  onDropClient,
  searchQuery = '',
  filters = {},
  loading = false
}) => {
  const [dropReason, setDropReason] = useState('');
  const [clientToDrop, setClientToDrop] = useState<string | null>(null);

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = searchQuery === '' || 
        client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.phone && client.phone.includes(searchQuery));
      
      const matchesTag = !filters.tag || 
        (client.tags && client.tags.includes(filters.tag));
      
      return matchesSearch && matchesTag;
    });
  }, [clients, searchQuery, filters]);

  const handleDropClient = (clientId: string) => {
    if (dropReason.trim()) {
      onDropClient(clientId, dropReason);
      setClientToDrop(null);
      setDropReason('');
    }
  };

  const getStatusBadge = (client: Client) => {
    if (client.isDropped) {
      return <Badge variant="destructive">Dropped</Badge>;
    }
    return <Badge variant="secondary">Active</Badge>;
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-white/70">
        Loading clients...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-white/20">
        <Table>
          <TableHeader>
            <TableRow className="border-white/20">
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Phone</TableHead>
              <TableHead className="text-white">Company</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Created</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id} className="border-white/20">
                <TableCell className="text-white">{client.fullName}</TableCell>
                <TableCell className="text-white">{client.email}</TableCell>
                <TableCell className="text-white">{client.phone}</TableCell>
                <TableCell className="text-white">{client.companyName || '-'}</TableCell>
                <TableCell>{getStatusBadge(client)}</TableCell>
                <TableCell className="text-white">
                  {new Date(client.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewClient(client)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditClient(client)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!client.isDropped && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setClientToDrop(client.id)}
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    )}
                    {onDeleteClient && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteClient(client.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-8 text-white/70">
          No clients found matching your criteria.
        </div>
      )}

      {clientToDrop && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Drop Client</h3>
            <textarea
              value={dropReason}
              onChange={(e) => setDropReason(e.target.value)}
              placeholder="Reason for dropping client..."
              className="w-full p-3 border rounded-md mb-4"
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setClientToDrop(null);
                  setDropReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDropClient(clientToDrop)}
                disabled={!dropReason.trim()}
              >
                Drop Client
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;
