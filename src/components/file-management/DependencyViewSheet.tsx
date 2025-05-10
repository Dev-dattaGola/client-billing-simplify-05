
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Filter, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import FileUploader from "./FileUploader";
import FileViewer from "./FileViewer";
import { FileMetadata, useFileStorage } from "@/lib/services/FileStorageService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const DependencyViewSheet = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [categories, setCategories] = useState<string[]>([
    "Legal Documents",
    "Medical Reports",
    "Case Files",
    "Client Records",
    "Insurance Documents",
    "Billing Records",
    "Miscellaneous"
  ]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  
  const { toast } = useToast();
  const { getAllFiles } = useFileStorage();
  const { currentUser } = useAuth();

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = () => {
    const allFiles = getAllFiles();
    setFiles(allFiles);
    
    // Extract unique categories from files
    const fileCategories = Array.from(new Set(allFiles.map(file => file.category)));
    if (fileCategories.length > 0) {
      setCategories(prev => {
        const newCategories = [...new Set([...prev, ...fileCategories])];
        return newCategories;
      });
    }
  };

  const filteredFiles = files.filter(file => {
    // Filter by search query
    const matchesSearch = 
      searchQuery === "" || 
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = !categoryFilter || file.category === categoryFilter;
    
    // Filter by tab
    let matchesTab = true;
    if (activeTab === "documents") {
      matchesTab = file.fileType === "document" || file.fileType === "pdf";
    } else if (activeTab === "images") {
      matchesTab = file.fileType === "image";
    } else if (activeTab === "other") {
      matchesTab = file.fileType === "other";
    }
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const handleUploadComplete = (fileId: string) => {
    loadFiles();
    setIsUploaderOpen(false);
    
    toast({
      title: "Upload Complete",
      description: "File has been uploaded successfully.",
    });
  };

  const handleDeleteFile = (fileId: string) => {
    loadFiles();
  };

  const handleEditFile = (file: FileMetadata) => {
    // In a real app, this would open an edit dialog
    toast({
      title: "Edit File",
      description: `Editing functionality would be implemented here for: ${file.name}`,
    });
  };
  
  // Check if user can upload files
  const canUploadFiles = () => {
    if (!currentUser) return false;
    
    // Admin, superadmin, and attorneys can upload files
    if (['admin', 'superadmin', 'attorney'].includes(currentUser.role)) {
      return true;
    }
    
    // Clients can upload only if they have the proper permission
    if (currentUser.role === 'client' && currentUser.permissions && currentUser.permissions.includes('upload:documents')) {
      return true;
    }
    
    return false;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search files..."
            className="pl-8 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select 
            value={categoryFilter || ''} 
            onValueChange={(value) => setCategoryFilter(value || null)}
          >
            <SelectTrigger className="w-full sm:w-40 h-10">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {canUploadFiles() && (
            <Dialog open={isUploaderOpen} onOpenChange={setIsUploaderOpen}>
              <DialogTrigger asChild>
                <Button className="h-10">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload File</DialogTitle>
                </DialogHeader>
                
                <div className="mt-4">
                  <div className="mb-4">
                    <Label htmlFor="category">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <FileUploader 
                    category={selectedCategory}
                    onUploadComplete={handleUploadComplete}
                    associatedId={currentUser?.id}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b px-4">
              <TabsList className="h-14">
                <TabsTrigger value="all">All Files</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="all" className="mt-0">
                <FileViewer 
                  files={filteredFiles} 
                  onDelete={handleDeleteFile} 
                  onEdit={handleEditFile}
                />
              </TabsContent>
              
              <TabsContent value="documents" className="mt-0">
                <FileViewer 
                  files={filteredFiles} 
                  onDelete={handleDeleteFile} 
                  onEdit={handleEditFile}
                />
              </TabsContent>
              
              <TabsContent value="images" className="mt-0">
                <FileViewer 
                  files={filteredFiles} 
                  onDelete={handleDeleteFile} 
                  onEdit={handleEditFile}
                />
              </TabsContent>
              
              <TabsContent value="other" className="mt-0">
                <FileViewer 
                  files={filteredFiles} 
                  onDelete={handleDeleteFile} 
                  onEdit={handleEditFile}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DependencyViewSheet;
