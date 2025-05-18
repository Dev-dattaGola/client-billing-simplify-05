
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CaseDetails from "./CaseDetails";
import CaseForm from "./CaseForm";
import CaseFilters from "./CaseFilters";
import CaseTabs from "./CaseTabs";
import AddPatientDialog from "./AddPatientDialog";
import { useCaseManagement } from "./useCaseManagement";

const CaseManagement = () => {
  const {
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
  } = useCaseManagement();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Create case form
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

  // Edit case form
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

  // Case details view
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

  // Case list view
  return (
    <div className="space-y-4">
      {/* Filters and action buttons */}
      <CaseFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        onAddPatient={handleAddPatient}
        onCreateNew={handleCreateNew}
      />

      {/* Add patient dialog */}
      <AddPatientDialog
        isOpen={isAddingPatient}
        onOpenChange={setIsAddingPatient}
        onSuccess={handlePatientCreated}
      />

      {/* Case tabs */}
      <CaseTabs
        cases={cases}
        clients={clients}
        searchQuery={searchQuery}
        onSelectCase={handleSelectCase}
      />
    </div>
  );
};

export default CaseManagement;
