
import React, { useState, useEffect } from 'react';
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, RefreshCcw } from "lucide-react";

interface ActivityLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  userRole: string;
  resource: string;
  resourceId: string;
  timestamp: Date;
  details?: string;
  firmId?: string;
}

// Mock API call for activity logs
const fetchActivityLogs = async (): Promise<ActivityLog[]> => {
  return [
    {
      id: 'log1',
      action: 'login',
      userId: 'admin1',
      userName: 'Administrator',
      userRole: 'admin',
      resource: 'auth',
      resourceId: 'admin1',
      timestamp: new Date(),
      firmId: 'firm1'
    },
    {
      id: 'log2',
      action: 'create',
      userId: 'admin1',
      userName: 'Administrator',
      userRole: 'admin',
      resource: 'client',
      resourceId: 'client1',
      timestamp: new Date(Date.now() - 3600000),
      details: 'Created new client: John Doe',
      firmId: 'firm1'
    },
    {
      id: 'log3',
      action: 'update',
      userId: 'attorney1',
      userName: 'Attorney User',
      userRole: 'attorney',
      resource: 'case',
      resourceId: 'case1',
      timestamp: new Date(Date.now() - 7200000),
      details: 'Updated case status to In Progress',
      firmId: 'firm1'
    }
  ];
};

const ActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const { toast } = useToast();

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const data = await fetchActivityLogs();
      setLogs(data);
    } catch (error) {
      console.error('Error loading activity logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load activity logs. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleRefresh = () => {
    loadLogs();
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString();
  };

  const getActionColor = (action: string): string => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'login':
        return 'bg-purple-100 text-purple-800';
      case 'logout':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter logs based on search term and filters
  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesRole = filterRole === 'all' || log.userRole === filterRole;
    
    return matchesSearch && matchesAction && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search activity logs..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="w-full sm:w-40">
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <span>Action</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-40">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <span>Role</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="attorney">Attorney</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Button onClick={handleRefresh} className="flex gap-2 whitespace-nowrap min-w-[120px]">
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-sm text-gray-500">No activity logs found.</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                      {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{log.userName}</div>
                      <div className="text-xs text-gray-500">{log.userRole}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="capitalize">{log.resource}</div>
                  </TableCell>
                  <TableCell>
                    <div className="whitespace-nowrap">{formatDate(log.timestamp)}</div>
                  </TableCell>
                  <TableCell>
                    {log.details || '-'}
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

export default ActivityLogs;
