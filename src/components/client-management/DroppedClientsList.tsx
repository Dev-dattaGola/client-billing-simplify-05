
import { useState } from "react";
import { Search, UserMinus, Eye, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Client } from "@/types/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DroppedClientsListProps {
  clients: Client[];
  onViewClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  loading?: boolean;
}

const DroppedClientsList = ({ 
  clients, 
  onViewClient, 
  onDeleteClient, 
  loading = false 
}: DroppedClientsListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  
  const filteredClients = clients.filter(client => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return client.fullName.toLowerCase().includes(query) ||
           client.email.toLowerCase().includes(query) ||
           (client.companyName && client.companyName.toLowerCase().includes(query));
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Dropped Clients</h3>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search dropped clients..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8 border rounded-lg bg-muted/20">
            <Loader2 className="mx-auto h-8 w-8 text-muted-foreground opacity-50 animate-spin" />
            <h3 className="mt-2 text-sm font-medium">Loading dropped clients...</h3>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-muted/20">
            <UserMinus className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
            <h3 className="mt-2 text-sm font-medium">No dropped clients found</h3>
            {searchQuery && (
              <p className="mt-1 text-xs text-muted-foreground">
                Try adjusting your search
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Dropped Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Reason</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {client.fullName}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {client.email}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {client.droppedDate ? format(new Date(client.droppedDate), 'MMM dd, yyyy') : "Unknown"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell max-w-xs truncate">
                      {client.droppedReason || "No reason provided"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onViewClient(client)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setClientToDelete(client)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Delete Permanently</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      <Dialog 
        open={!!clientToDelete} 
        onOpenChange={(isOpen) => !isOpen && setClientToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Permanently delete this client?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the client
              and remove their data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setClientToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (clientToDelete) {
                  onDeleteClient(clientToDelete.id);
                  setClientToDelete(null);
                }
              }}
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DroppedClientsList;
