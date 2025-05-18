
import { useState } from "react";
import { Search, Plus, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CaseFiltersProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddPatient: () => void;
  onCreateNew: () => void;
}

const CaseFilters = ({
  searchQuery,
  onSearchChange,
  onAddPatient,
  onCreateNew,
}: CaseFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search cases..."
          className="pl-9"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={onAddPatient} variant="outline" className="gap-1 whitespace-nowrap">
          <UserPlus className="h-4 w-4" />
          Add Patient
        </Button>
        <Button onClick={onCreateNew} className="gap-1 whitespace-nowrap">
          <Plus className="h-4 w-4" />
          New Case
        </Button>
      </div>
    </div>
  );
};

export default CaseFilters;
