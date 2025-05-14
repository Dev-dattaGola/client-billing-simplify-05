
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useFileStorage } from "@/lib/services/FileStorageService";
import { Upload, Loader2, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
  category: string;
  associatedId?: string;
  onUploadComplete?: (fileId: string) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
  buttonText?: string;
  multiple?: boolean;
  tags?: string[];
}

const FileUploader = ({
  category,
  associatedId,
  onUploadComplete,
  allowedTypes = ["image/*", "application/pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt"],
  maxSizeMB = 10,
  buttonText = "Upload File",
  multiple = false,
  tags = [],
}: FileUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { uploadFile } = useFileStorage();

  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const files = Array.from(e.target.files);
    
    // Check file types
    const invalidTypeFiles = files.filter(
      file => !allowedTypes.some(type => {
        if (type.includes("*")) {
          // Handle wildcard types (e.g., "image/*")
          return file.type.startsWith(type.split("/")[0]);
        }
        // Handle extensions (e.g., ".pdf")
        if (type.startsWith(".")) {
          return file.name.endsWith(type);
        }
        // Handle exact types (e.g., "application/pdf")
        return file.type === type;
      })
    );

    if (invalidTypeFiles.length > 0) {
      toast({
        title: "Invalid File Type",
        description: `${invalidTypeFiles.map(f => f.name).join(', ')} ${invalidTypeFiles.length > 1 ? 'are' : 'is'} not of an allowed file type.`,
        variant: "destructive",
      });
      return;
    }

    // Check file sizes
    const oversizedFiles = files.filter(file => file.size > maxSizeBytes);
    if (oversizedFiles.length > 0) {
      toast({
        title: "File Too Large",
        description: `${oversizedFiles.map(f => f.name).join(', ')} ${oversizedFiles.length > 1 ? 'exceed' : 'exceeds'} the maximum size of ${maxSizeMB}MB.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (!currentUser || selectedFiles.length === 0) return;

    setIsUploading(true);
    setProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Simulate upload progress
        const interval = setInterval(() => {
          setProgress(prev => {
            const newProgress = prev + Math.random() * 10;
            return newProgress > 90 ? 90 : newProgress;
          });
        }, 200);

        const metadata = await uploadFile(
          file,
          category,
          currentUser.name,
          currentUser.id,
          associatedId,
          tags
        );

        clearInterval(interval);
        setProgress(100);

        if (onUploadComplete) {
          onUploadComplete(metadata.id);
        }

        // Reset progress for next file
        if (i < selectedFiles.length - 1) {
          setTimeout(() => setProgress(0), 500);
        }
      }

      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${selectedFiles.length} ${selectedFiles.length > 1 ? 'files' : 'file'}.`,
      });
      
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file(s).",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearFileSelection = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="border rounded-lg p-0 overflow-hidden">
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {buttonText}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept={allowedTypes.join(",")}
            multiple={multiple}
            className="hidden"
          />
          
          {selectedFiles.length > 0 && (
            <Button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full sm:w-auto"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Start Upload"
              )}
            </Button>
          )}
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="text-sm font-medium">Selected Files:</div>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm truncate flex-1">{file.name}</span>
                  <span className="text-xs text-gray-500 mx-2">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFiles(prevFiles => 
                        prevFiles.filter((_, i) => i !== index)
                      );
                    }}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            {!isUploading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFileSelection}
                className="text-red-500 hover:text-red-700 p-0"
              >
                Clear All
              </Button>
            )}
          </div>
        )}

        {isUploading && (
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-center">{Math.round(progress)}%</p>
          </div>
        )}
        
        <div className="text-xs text-gray-500 mt-2">
          {allowedTypes.includes("image/*") ? "Images, " : ""}
          {allowedTypes.includes("application/pdf") ? "PDFs, " : ""}
          {allowedTypes.some(t => t.includes(".doc")) ? "Word documents, " : ""}
          {allowedTypes.some(t => t.includes(".xls")) ? "Excel spreadsheets, " : ""}
          {allowedTypes.some(t => t.includes(".ppt")) ? "PowerPoint presentations, " : ""}
          {allowedTypes.includes(".txt") ? "Text files, " : ""}
          Max {maxSizeMB}MB
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploader;
