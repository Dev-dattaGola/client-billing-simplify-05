
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
  Filter
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import MedicalReportForm from "./MedicalReportForm";

// Define the Medical Report type based on the schema
export interface MedicalReport {
  id: string;
  client_id: string;
  case_id: string;
  provider_name: string;
  document_type: "LOP" | "Bill" | "Records" | "Other";
  visit_date: string;
  document_url: string;
  notes?: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  client_name?: string; // For display purposes
}

// Mock data for initial development
const mockMedicalReports: MedicalReport[] = [
  {
    id: "1",
    client_id: "1",
    case_id: "case-001",
    provider_name: "St. Mary's Hospital",
    document_type: "Records",
    visit_date: "2023-06-15",
    document_url: "#",
    notes: "Initial evaluation records",
    uploaded_by: "user-123",
    created_at: "2023-06-17T10:30:00Z",
    updated_at: "2023-06-17T10:30:00Z",
    client_name: "John Doe"
  },
  {
    id: "2",
    client_id: "2",
    case_id: "case-002",
    provider_name: "Dr. Smith Clinic",
    document_type: "LOP",
    visit_date: "2023-07-22",
    document_url: "#",
    notes: "Letter of protection for ongoing treatment",
    uploaded_by: "user-123",
    created_at: "2023-07-23T14:45:00Z",
    updated_at: "2023-07-23T14:45:00Z",
    client_name: "Jane Smith"
  },
  {
    id: "3",
    client_id: "1",
    case_id: "case-001",
    provider_name: "Citywide Medical Center",
    document_type: "Bill",
    visit_date: "2023-08-05",
    document_url: "#",
    notes: "Treatment and medication charges",
    uploaded_by: "user-456",
    created_at: "2023-08-06T09:15:00Z",
    updated_at: "2023-08-06T09:15:00Z",
    client_name: "John Doe"
  }
];

const MedicalReportsSheet = () => {
  const [reports, setReports] = useState<MedicalReport[]>(mockMedicalReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [reportToEdit, setReportToEdit] = useState<MedicalReport | null>(null);
  
  const filteredReports = reports.filter(report => 
    report.provider_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.document_type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddReport = (reportData: Omit<MedicalReport, 'id' | 'created_at' | 'updated_at' | 'uploaded_by'>) => {
    const timestamp = new Date().toISOString();
    const newReport: MedicalReport = {
      id: `report-${Date.now()}`,
      uploaded_by: "current-user", // Would be replaced with actual user ID in real application
      created_at: timestamp,
      updated_at: timestamp,
      ...reportData
    };
    
    setReports([...reports, newReport]);
    setShowAddForm(false);
    toast({
      title: "Medical Report Added",
      description: "The medical report has been successfully added."
    });
  };
  
  const handleEditReport = (reportData: MedicalReport) => {
    const updatedReports = reports.map(report => 
      report.id === reportData.id 
        ? { ...reportData, updated_at: new Date().toISOString() } 
        : report
    );
    
    setReports(updatedReports);
    setReportToEdit(null);
    toast({
      title: "Medical Report Updated",
      description: "The medical report has been successfully updated."
    });
  };
  
  const handleDeleteReport = (id: string) => {
    setReports(reports.filter(report => report.id !== id));
    toast({
      title: "Medical Report Deleted",
      description: "The medical report has been successfully removed."
    });
  };
  
  const handleDownload = (id: string) => {
    // In a real application, this would initiate a file download
    toast({
      title: "Downloading Report",
      description: "Your medical report is being downloaded."
    });
  };
  
  if (showAddForm || reportToEdit) {
    return (
      <MedicalReportForm 
        initialData={reportToEdit} 
        onSubmit={reportToEdit ? handleEditReport : handleAddReport}
        onCancel={() => {
          setShowAddForm(false);
          setReportToEdit(null);
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
            placeholder="Search reports..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Report
        </Button>
      </div>
      
      {filteredReports.length > 0 ? (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Visit Date</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.client_name}</TableCell>
                    <TableCell>{report.provider_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-blue-500" />
                        {report.document_type}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(report.visit_date).toLocaleDateString()}</TableCell>
                    <TableCell className="max-w-xs truncate">{report.notes}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setReportToEdit(report)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDownload(report.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteReport(report.id)}
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
          <h3 className="text-lg font-medium mb-1">No medical reports found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search criteria" : "Add your first medical report to get started"}
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicalReportsSheet;
