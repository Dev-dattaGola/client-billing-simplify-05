
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Client } from "@/types/client";
import { MoreHorizontal, AlertTriangle, Calendar, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface ClientListProps {
  clients: Client[];
  onEditClient: (clientId: string) => void;
  onViewClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  loading?: boolean;
  showDroppedInfo?: boolean;
}

const ClientList: React.FC<ClientListProps> = ({
  clients,
  onEditClient,
  onViewClient,
  onDeleteClient,
  loading = false,
  showDroppedInfo = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { hasPermission } = useAuth();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredClients = clients.filter((client) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.fullName.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.phone?.toLowerCase().includes(searchLower) ||
      client.companyName?.toLowerCase().includes(searchLower) ||
      client.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div>
        <div className="pb-4">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="rounded-md border">
          <div className="grid grid-cols-4 py-3 px-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-5 w-[80%]" />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-4 py-3 px-4 border-t">
              {Array.from({ length: 4 }).map((_, cellIndex) => (
                <Skeleton key={cellIndex} className="h-5 w-[80%]" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No clients found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="pb-4">
        <Input
          placeholder="Search clients..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Tags</TableHead>
              {showDroppedInfo && <TableHead>Dropped Date</TableHead>}
              {showDroppedInfo && <TableHead>Reason</TableHead>}
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={showDroppedInfo ? 6 : 4}
                  className="text-center py-8"
                >
                  <p className="text-muted-foreground">No matching clients found.</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div>
                      <div
                        className="font-medium hover:underline cursor-pointer"
                        onClick={() => onViewClient(client)}
                      >
                        {client.fullName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {client.companyName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{client.email}</div>
                      <div className="text-muted-foreground">{client.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {client.tags?.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  {showDroppedInfo && (
                    <TableCell>
                      {client.droppedDate ? new Date(client.droppedDate).toLocaleDateString() : 'N/A'}
                    </TableCell>
                  )}
                  {showDroppedInfo && (
                    <TableCell>
                      <div className="max-w-xs truncate" title={client.droppedReason || ''}>
                        {client.droppedReason || 'N/A'}
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewClient(client)}>
                          <FileText className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {hasPermission('edit:clients') && (
                          <DropdownMenuItem onClick={() => onEditClient(client)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Edit Client
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onViewClient(client)}>
                          <Calendar className="mr-2 h-4 w-4" />
                          View Appointments
                        </DropdownMenuItem>
                        {hasPermission('edit:clients') && (
                          <DropdownMenuItem
                            onClick={() => onDeleteClient(client.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Delete Client
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientList;
