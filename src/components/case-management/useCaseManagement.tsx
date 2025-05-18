
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Case } from "@/types/case";
import { casesApi, clientsApi } from "@/lib/api/mongodb-api";
import { Client } from "@/types/client";

export const useCaseManagement = () => {
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

  // Get client ID and new flag from URL
  const clientIdFromURL = searchParams.get('clientId');
  const isNewFromURL = searchParams.get('new') === 'true';

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

  return {
    cases,
    clients,
    selectedCase,
    isLoading,
    isCreating,
    isEditing,
    searchQuery,
    isAddingPatient,
    clientIdFromURL,
    handleSearch,
    handleBackToList,
    handleSelectCase,
    handleCreateNew,
    handleEditCase,
    handleCancelEdit,
    handleCaseFormSubmit,
    handleAddPatient,
    handlePatientCreated,
    setIsAddingPatient
  };
};
