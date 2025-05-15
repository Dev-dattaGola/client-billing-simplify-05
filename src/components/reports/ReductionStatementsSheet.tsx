import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  FileText, 
  Download, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  DollarSign,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import ReductionStatementForm from "./ReductionStatementForm";

// Define the Reduction Statement type
export interface ReductionStatement {
  id: string;
  client_id: string;
  case_id: string;
  provider_name: string;
  original_amount: number;
  ai_reduction_suggestion: number;
  reduction_reasoning: string;
  status: "Pending" | "Approved" | "Sent to Provider";
  document_url: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  client_name?: string; // For display purposes
}

// Mock data for initial development
const mockReductionStatements: ReductionStatement[] = [
  {
    id: "1",
    client_id: "1",
    case_id: "case-001",
    provider_name: "St. Mary's Hospital",
    original_amount: 5000.00,
    ai_reduction_suggestion: 3750.00,
    reduction_reasoning: "Overcharged for standard procedures based on comparative data",
    status: "Pending",
    document_url: "#",
    created_by: "user-123",
    created_at: "2023-06-17T10:30:00Z",
    updated_at: "2023-06-17T10:30:00Z",
    client_name: "John Doe"
  },
  {
    id: "2",
    client_id: "2",
    case_id: "case-002",
    provider_name: "Dr. Smith Clinic",
    original_amount: 2500.00,
    ai_reduction_suggestion: 1875.00,
    reduction_reasoning: "25% reduction recommended due to duplicate billing entries",
    status: "Approved",
    document_url: "#",
    created_by: "user-123",
    created_at: "2023-07-23T14:45:00Z",
    updated_at: "2023-07-25T09:15:00Z",
    client_name: "Jane Smith"
  },
  {
    id: "3",
    client_id: "1",
    case_id: "case-001",
    provider_name: "Citywide Medical Center",
    original_amount: 8000.00,
    ai_reduction_suggestion: 6000.00,
    reduction_reasoning: "Standard reduction for outpatient procedures",
    status: "Sent to Provider",
    document_url: "#",
    created_by: "user-456",
    created_at: "2023-08-06T09:15:00Z",
    updated_at: "2023-08-10T14:30:00Z",
    client_name: "John Doe"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "Approved":
      return "bg-green-100 text-green-800 border-green-300";
    case "Sent to Provider":
      return "bg-blue-100 text-blue-800 border-blue-300";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ReductionStatementsSheet = () => {
  const { toast } = useToast();
  const [statements, setStatements] = useState<ReductionStatement[]>(mockReductionStatements);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [statementToEdit, setStatementToEdit] = useState<ReductionStatement | null>(null);
  
  const filteredStatements = statements.filter(statement => 
    statement.provider_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    statement.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    statement.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddStatement = (statementData: Omit<ReductionStatement, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    const timestamp = new Date().toISOString();
    const newStatement: ReductionStatement = {
      id: `statement-${Date.now()}`,
      created_by: "current-user", // Would be replaced with actual user ID in real application
      created_at: timestamp,
      updated_at: timestamp,
      ...statementData
    };
    
    setStatements([...statements, newStatement]);
    setShowAddForm(false);
    toast({
      title: "Reduction Statement Added",
      description: "The reduction statement has been successfully added."
    });
  };
  
  const handleEditStatement = (statementData: ReductionStatement) => {
    const updatedStatements = statements.map(statement => 
      statement.id === statementData.id 
        ? { ...statementData, updated_at: new Date().toISOString() } 
        : statement
    );
    
    setStatements(updatedStatements);
    setStatementToEdit(null);
    toast({
      title: "Reduction Statement Updated",
      description: "The reduction statement has been successfully updated."
    });
  };
  
  const handleDeleteStatement = (id: string) => {
    setStatements(statements.filter(statement => statement.id !== id));
    toast({
      title: "Reduction Statement Deleted",
      description: "The reduction statement has been successfully removed."
    });
  };
  
  const handleDownload = (id: string) => {
    // In a real application, this would initiate a file download
    toast({
      title: "Downloading Statement",
      description: "Your reduction statement is being downloaded."
    });
  };
  
  if (showAddForm || statementToEdit) {
    return (
      <ReductionStatementForm 
        initialData={statementToEdit} 
        onSubmit={statementToEdit ? handleEditStatement : handleAddStatement}
        onCancel={() => {
          setShowAddForm(false);
          setStatementToEdit(null);
        }}
      />
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search statements..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Statement
        </Button>
      </div>
      
      {filteredStatements.length > 0 ? (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Original Amount</TableHead>
                  <TableHead>Reduced Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStatements.map((statement) => (
                  <TableRow key={statement.id}>
                    <TableCell>{statement.client_name}</TableCell>
                    <TableCell>{statement.provider_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-red-500" />
                        {statement.original_amount.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                        {statement.ai_reduction_suggestion.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(statement.status)}>
                        {statement.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setStatementToEdit(statement)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDownload(statement.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteStatement(statement.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <div className="text-center py-10 border rounded-md">
          <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <h3 className="text-lg font-medium mb-1">No reduction statements found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search criteria" : "Add your first reduction statement to get started"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReductionStatementsSheet;
