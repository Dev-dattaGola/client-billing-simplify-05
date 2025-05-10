
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { FileMetadata, useFileStorage } from "@/lib/services/FileStorageService";
import { Download, Eye, FileText, File as FileIcon, FileImage, FilePdf, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useAuth } from "@/contexts/AuthContext";

interface FileViewerProps {
  files: FileMetadata[];
  onDelete?: (fileId: string) => void;
  onEdit?: (file: FileMetadata) => void;
  showActions?: boolean;
}

const FileViewer = ({
  files,
  onDelete,
  onEdit,
  showActions = true,
}: FileViewerProps) => {
  const [viewingFile, setViewingFile] = useState<FileMetadata | null>(null);
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { downloadFile, deleteFile } = useFileStorage();

  const handleDownload = async (file: FileMetadata) => {
    try {
      await downloadFile(file.id);
      toast({
        title: "Download Started",
        description: `${file.name} will be downloaded shortly.`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the file.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (file: FileMetadata) => {
    if (confirm(`Are you sure you want to delete ${file.name}?`)) {
      try {
        const success = deleteFile(file.id);
        
        if (success) {
          toast({
            title: "File Deleted",
            description: `${file.name} has been successfully deleted.`,
          });
          
          if (onDelete) {
            onDelete(file.id);
          }
        } else {
          throw new Error("Failed to delete file");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast({
          title: "Delete Failed",
          description: "There was an error deleting the file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (file: FileMetadata) => {
    if (onEdit) {
      onEdit(file);
    }
  };

  // Group files by category
  const filesByCategory: Record<string, FileMetadata[]> = {};
  files.forEach(file => {
    if (!filesByCategory[file.category]) {
      filesByCategory[file.category] = [];
    }
    filesByCategory[file.category].push(file);
  });

  // Get file icon based on fileType
  const getFileIcon = (fileType: string, className: string = "h-10 w-10") => {
    switch (fileType) {
      case 'pdf':
        return <FilePdf className={`${className} text-red-500`} />;
      case 'image':
        return <FileImage className={`${className} text-blue-500`} />;
      case 'document':
        return <FileText className={`${className} text-yellow-500`} />;
      default:
        return <FileIcon className={`${className} text-gray-500`} />;
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  // Check if user can edit/delete files
  const canEditFiles = () => {
    if (!currentUser) return false;
    
    // Admin and superadmin can edit all files
    if (['admin', 'superadmin'].includes(currentUser.role)) {
      return true;
    }
    
    // Attorneys can edit their own files
    if (currentUser.role === 'attorney') {
      return true;
    }
    
    return false;
  };

  return (
    <div className="space-y-6">
      {files.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center text-gray-500">
            No files found.
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={Object.keys(filesByCategory)[0]} className="w-full">
          {Object.keys(filesByCategory).length > 1 && (
            <TabsList className="grid w-full" style={{
              gridTemplateColumns: `repeat(${Object.keys(filesByCategory).length}, 1fr)`
            }}>
              {Object.keys(filesByCategory).map(category => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          )}

          {Object.entries(filesByCategory).map(([category, categoryFiles]) => (
            <TabsContent key={category} value={category} className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{category} Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryFiles.map(file => (
                      <div key={file.id} className="border rounded-md p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            {getFileIcon(file.fileType)}
                            <div className="ml-4">
                              <h3 className="font-medium">{file.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{
                                file.type.split('/')[1] ? file.type.split('/')[1].toUpperCase() : 'Document'
                              }</p>
                              <div className="flex items-center mt-2 text-sm">
                                <span className="font-medium">Uploaded:</span>
                                <span className="ml-1">{formatDate(file.uploadDate)}</span>
                                <span className="mx-2">•</span>
                                <span className="font-medium">By:</span>
                                <span className="ml-1">{file.uploadedBy}</span>
                              </div>
                              <div className="mt-1 text-sm">
                                <span className="font-medium">Size:</span>
                                <span className="ml-1">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                              </div>
                            </div>
                          </div>
                          {showActions && (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setViewingFile(file)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDownload(file)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                              {canEditFiles() && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleEdit(file)}
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-red-600 hover:bg-red-50"
                                    onClick={() => handleDelete(file)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                  </Button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* File Viewer Dialog */}
      {viewingFile && (
        <Dialog open={!!viewingFile} onOpenChange={() => setViewingFile(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{viewingFile.name}</DialogTitle>
            </DialogHeader>
            
            <div className="mt-4">
              {viewingFile.fileType === 'image' ? (
                <AspectRatio ratio={16 / 9} className="bg-gray-100 overflow-hidden rounded-md">
                  <img
                    src={viewingFile.url}
                    alt={viewingFile.name}
                    className="object-contain w-full h-full"
                  />
                </AspectRatio>
              ) : viewingFile.fileType === 'pdf' ? (
                <div className="h-[60vh] w-full border rounded-md overflow-hidden">
                  <iframe
                    src={viewingFile.url}
                    title={viewingFile.name}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-md">
                  <div className="flex justify-center mb-4">
                    {getFileIcon(viewingFile.fileType, "h-20 w-20")}
                  </div>
                  <h3 className="text-lg font-medium">{viewingFile.name}</h3>
                  <p className="mt-2 text-gray-500">
                    Preview not available. Please download the file to view it.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => handleDownload(viewingFile)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm">
                <span className="font-medium">Uploaded by:</span> {viewingFile.uploadedBy} on {formatDate(viewingFile.uploadDate)}
              </div>
              <Button onClick={() => handleDownload(viewingFile)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FileViewer;
