import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { FileMetadata } from "@/lib/services/FileStorageService";
import { Button } from "@/components/ui/button";

interface DependencyViewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  files: FileMetadata[];
}

const DependencyViewSheet: React.FC<DependencyViewSheetProps> = ({
  open,
  onOpenChange,
  files
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  
  // Fix for the typing error - properly type the callback function for setState
  const toggleSelected = (id: string) => {
    setSelected((prev: string[]) => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Dependency View</SheetTitle>
        </SheetHeader>
        {/* Add your dependency view content here */}
        <div className="mt-6">
          {files.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No files found.</p>
          ) : (
            <div className="space-y-4">
              {files.map(file => (
                <div key={file.id} className="border p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{file.name}</h3>
                      <p className="text-sm text-muted-foreground">{file.category}</p>
                    </div>
                    <Button
                      variant={selected.includes(file.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSelected(file.id)}
                    >
                      {selected.includes(file.id) ? "Selected" : "Select"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DependencyViewSheet;
