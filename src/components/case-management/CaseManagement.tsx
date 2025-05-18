
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { Plus, Search, Filter, SlidersHorizontal, Loader2, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Case } from "@/types/case";
import { casesApi } from "@/lib/api/mongodb-api";
import CaseList from "./CaseList";
import CaseDetails from "./CaseDetails";
import CaseForm from "./CaseForm";
import { Client } from "@/types/client";
import { clientsApi } from "@/lib/api/mongodb-api";
import PatientForm from "@/components/patients/PatientForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const CaseManagement = () => {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [cases, setCases] = useState<Case[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingPatient, setIsAddingPatient] = useState(false);

  // Memoize values derived from searchParams to prevent unnecessary re-renders
  const clientIdFromURL = useMemo(() => searchParams.get('clientId'), [searchParams]);
  const isNewFromURL = useMemo(() => searchParams.get('new') === 'true', [searchParams]);

  // Fetch data only when component mounts or when specific dependencies change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Use Promise.all to fetch data in parallel
        const [casesData, clientsData] = await Promise.all([
          casesApi.getCases(),
          clientsApi.getClients()
        ]);
        
        setCases(casesData);
        setClients(clientsData);
        
        // Only attempt to fetch a case if we have an ID
        if (id) {
          const caseItem = await casesApi.getCase(id);
          if (caseItem) {
            setSelectedCase(caseItem);
          } else {
            toast({
              title: "Error",
              description: "Case not found",
              variant: "destructive",
            });
            navigate('/cases');
          }
        } else if (isNewFromURL) {
          setIsCreating(true);
        }
      } catch (error) {
        console.error("Error fetching cases:", error);
        toast({
          title: "Error",
          description: "Failed to load cases. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, toast, isNewFromURL]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedCase(null);
    navigate('/cases');
  }, [navigate]);

  const handleSelectCase = useCallback((caseItem: Case) => {
    setSelectedCase(caseItem);
    setIsCreating(false);
    setIsEditing(false);
    navigate(`/cases/${caseItem.id}`);
  }, [navigate]);

  const handleCreateNew = useCallback(() => {
    setSelectedCase(null);
    setIsCreating(true);
    setIsEditing(false);
    navigate(`/cases/create${clientIdFromURL ? `?clientId=${clientIdFromURL}` : ''}`);
  }, [navigate, clientIdFromURL]);

  const handleEditCase = useCallback((caseItem: Case) => {
    setSelectedCase(caseItem);
    setIsEditing(true);
    navigate(`/cases/${caseItem.id}/edit`);
  }, [navigate]);

  const handleCancelEdit = useCallback(() => {
    if (selectedCase) {
      setIsEditing(false);
      navigate(`/cases/${selectedCase.id}`);
    } else {
      setIsCreating(false);
      navigate('/cases');
    }
  }, [selectedCase, navigate]);

  const handleCaseFormSubmit = useCallback(async (data: any) => {
    try {
      if (isEditing && selectedCase) {
        const updatedCase = await casesApi.updateCase(selectedCase.id, data);
        if (updatedCase) {
          toast({
            title: "Success",
            description: "Case updated successfully",
          });
          
          setCases(prevCases => prevCases.map(c => c.id === updatedCase.id ? updatedCase : c));
          setSelectedCase(updatedCase);
          setIsEditing(false);
          navigate(`/cases/${updatedCase.id}`);
        }
      } else {
        const newCase = await casesApi.createCase(data);
        if (newCase) {
          toast({
            title: "Success",
            description: "Case created successfully",
          });
          
          setCases(prevCases => [...prevCases, newCase]);
          setSelectedCase(newCase);
          setIsCreating(false);
          navigate(`/cases/${newCase.id}`);
        }
      }
    } catch (error) {
      console.error("Error saving case:", error);
      toast({
        title: "Error",
        description: "Failed to save case. Please try again.",
        variant: "destructive",
      });
    }
  }, [isEditing, selectedCase, navigate, toast]);

  const handleAddPatient = useCallback(() => {
    setIsAddingPatient(true);
  }, []);

  const handlePatientCreated = useCallback(() => {
    setIsAddingPatient(false);
    toast({
      title: "Success",
      description: "Patient has been created successfully",
    });
  }, [toast]);

  // Memoize filtered cases to avoid recalculating on every render
  const filteredCases = useMemo(() => {
    return cases.filter(
      (caseItem) =>
        caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caseItem.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [cases, searchQuery]);

  // Move render content into a memoized component to prevent unnecessary re-renders
  const renderContent = useCallback(() => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (isCreating) {
      return (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6">Create New Case</h2>
          <CaseForm
            initialData={null}
            clientId={clientIdFromURL || undefined}
            onSubmit={handleCaseFormSubmit}
            onCancel={handleCancelEdit}
          />
        </div>
      );
    }

    if (isEditing && selectedCase) {
      return (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6">Edit Case</h2>
          <CaseForm
            initialData={selectedCase}
            onSubmit={handleCaseFormSubmit}
            onCancel={handleCancelEdit}
          />
        </div>
      );
    }

    if (selectedCase) {
      const client = clients.find((c) => c.id === selectedCase.clientId);
      
      return (
        <CaseDetails 
          caseItem={selectedCase} 
          client={client}
          onBack={handleBackToList}
          onEdit={() => handleEditCase(selectedCase)}
        />
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cases..."
              className="pl-9"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddPatient} variant="outline" className="gap-1 whitespace-nowrap">
              <UserPlus className="h-4 w-4" />
              Add Patient
            </Button>
            <Button onClick={handleCreateNew} className="gap-1 whitespace-nowrap">
              <Plus className="h-4 w-4" />
              New Case
            </Button>
          </div>
        </div>

        <Dialog open={isAddingPatient} onOpenChange={setIsAddingPatient}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
            </DialogHeader>
            <PatientForm
              onSuccess={handlePatientCreated}
              onCancel={() => setIsAddingPatient(false)}
            />
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">All Cases</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <CaseList 
              cases={filteredCases}
              clients={clients} 
              onSelectCase={handleSelectCase}
            />
          </TabsContent>
          
          <TabsContent value="open">
            <CaseList 
              cases={filteredCases.filter(c => c.status === 'open')}
              clients={clients} 
              onSelectCase={handleSelectCase}
            />
          </TabsContent>
          
          <TabsContent value="pending">
            <CaseList 
              cases={filteredCases.filter(c => c.status === 'pending')}
              clients={clients} 
              onSelectCase={handleSelectCase}
            />
          </TabsContent>
          
          <TabsContent value="closed">
            <CaseList 
              cases={filteredCases.filter(c => c.status === 'closed' || c.status === 'settled')}
              clients={clients} 
              onSelectCase={handleSelectCase}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }, [
    isLoading, 
    isCreating, 
    isEditing, 
    selectedCase, 
    clients, 
    filteredCases, 
    searchQuery, 
    clientIdFromURL, 
    isAddingPatient,
    handleSearch, 
    handleBackToList, 
    handleSelectCase, 
    handleCreateNew, 
    handleEditCase, 
    handleCancelEdit, 
    handleCaseFormSubmit, 
    handleAddPatient, 
    handlePatientCreated
  ]);

  // Return the memoized content directly
  return renderContent();
};

export default CaseManagement;
