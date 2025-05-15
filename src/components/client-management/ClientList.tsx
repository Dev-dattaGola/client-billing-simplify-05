
import { useState } from "react";
import { Search, Filter, UserMinus, Edit, Tags, Loader2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Client, ClientFilterParams } from "@/types/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { format, isAfter, isBefore, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ClientListProps {
  clients: Client[];
  onEditClient: (client: Client) => void;
  onViewClient: (client: Client) => void;
  onDropClient?: (clientId: string, reason: string) => void;
  loading?: boolean;
}

const ClientList = ({ 
  clients, 
  onEditClient, 
  onViewClient, 
  onDropClient, 
  loading = false 
}: ClientListProps) => {
  const [filterParams, setFilterParams] = useState<ClientFilterParams>({
    search: "",
    tag: undefined,
    dateRange: undefined
  });
  const [showFilters, setShowFilters] = useState(false);
  const [clientToDrop, setClientToDrop] = useState<Client | null>(null);
  const [dropReason, setDropReason] = useState<string>("");
  
  const uniqueTags = [...new Set(clients.flatMap(client => client.tags || []))];
  
  const filteredClients = clients.filter(client => {
    const searchMatch = !filterParams.search || 
      client.fullName.toLowerCase().includes(filterParams.search.toLowerCase()) ||
      client.email.toLowerCase().includes(filterParams.search.toLowerCase()) ||
      client.companyName?.toLowerCase().includes(filterParams.search.toLowerCase()) ||
      false;
    
    const tagMatch = !filterParams.tag || 
      client.tags?.includes(filterParams.tag) || 
      false;
    
    let dateMatch = true;
    if (filterParams.dateRange?.from || filterParams.dateRange?.to) {
      const createdDate = new Date(client.createdAt);
      
      if (filterParams.dateRange.from && isValid(filterParams.dateRange.from)) {
        dateMatch = dateMatch && isAfter(createdDate, filterParams.dateRange.from);
      }
      
      if (filterParams.dateRange.to && isValid(filterParams.dateRange.to)) {
        dateMatch = dateMatch && isBefore(createdDate, filterParams.dateRange.to);
      }
    }
    
    return searchMatch && tagMatch && dateMatch;
  });

  const handleConfirmDrop = () => {
    if (clientToDrop && onDropClient) {
      onDropClient(clientToDrop.id, dropReason);
      setClientToDrop(null);
      setDropReason("");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-9"
              value={filterParams.search}
              onChange={(e) => setFilterParams({...filterParams, search: e.target.value})}
            />
          </div>
          
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-sm font-medium mb-2">Filter by Tag</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Tags className="h-4 w-4" />
                    {filterParams.tag || "Select Tag"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterParams({...filterParams, tag: undefined})}>
                    All Tags
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {uniqueTags.map(tag => (
                    <DropdownMenuItem 
                      key={tag}
                      onClick={() => setFilterParams({...filterParams, tag})}
                    >
                      {tag}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Created Date Range</p>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left font-normal",
                        !filterParams.dateRange?.from && "text-muted-foreground"
                      )}
                    >
                      {filterParams.dateRange?.from ? (
                        format(filterParams.dateRange.from, "PPP")
                      ) : (
                        "From date"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filterParams.dateRange?.from}
                      onSelect={(date) =>
                        setFilterParams({
                          ...filterParams,
                          dateRange: { 
                            ...filterParams.dateRange,
                            from: date
                          }
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left font-normal",
                        !filterParams.dateRange?.to && "text-muted-foreground"
                      )}
                    >
                      {filterParams.dateRange?.to ? (
                        format(filterParams.dateRange.to, "PPP")
                      ) : (
                        "To date"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filterParams.dateRange?.to}
                      onSelect={(date) =>
                        setFilterParams({
                          ...filterParams,
                          dateRange: {
                            ...filterParams.dateRange,
                            to: date
                          }
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="ghost" 
                onClick={() => setFilterParams({ search: "" })}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <Loader2 className="mx-auto h-12 w-12 text-muted-foreground opacity-50 animate-spin" />
            <h3 className="mt-4 text-lg font-medium">Loading clients...</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Please wait while we fetch client data
            </p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-medium">No clients found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead className="hidden md:table-cell">Company</TableHead>
                  <TableHead className="hidden lg:table-cell">Tags</TableHead>
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
                      {client.phone}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {client.companyName || "-"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {client.tags?.map(tag => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                        {!client.tags?.length && "-"}
                      </div>
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
                          onClick={() => onEditClient(client)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setClientToDrop(client);
                            setDropReason("");
                          }}
                        >
                          <UserMinus className="h-4 w-4" />
                          <span className="sr-only">Drop Client</span>
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
        open={!!clientToDrop} 
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setClientToDrop(null);
            setDropReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Drop this client?</DialogTitle>
            <DialogDescription>
              This will move the client to the dropped clients list. They will no longer appear in your active clients.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="drop-reason" className="mb-2 block">Reason for dropping</Label>
            <Textarea
              id="drop-reason"
              placeholder="Please provide a reason for dropping this client..."
              value={dropReason}
              onChange={(e) => setDropReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="default"
              onClick={handleConfirmDrop}
            >
              Drop Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClientList;
