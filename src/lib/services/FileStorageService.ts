import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/components/ui/use-toast";

// Define the file types we'll support
export type FileType = 'document' | 'image' | 'pdf' | 'other';

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  fileType: FileType;
  url: string;
  uploadedBy: string;
  uploadedById: string;
  uploadDate: string;
  category: string;
  associatedId?: string; // client ID, case ID, etc.
  tags?: string[];
}

class FileStorageService {
  private static instance: FileStorageService;
  private fileStorage: Map<string, FileMetadata> = new Map();
  private fileDataStorage: Map<string, Blob> = new Map();
  
  // Use singleton pattern to ensure we have only one instance
  public static getInstance(): FileStorageService {
    if (!FileStorageService.instance) {
      FileStorageService.instance = new FileStorageService();
    }
    return FileStorageService.instance;
  }
  
  // Upload a file
  public async uploadFile(
    file: File, 
    category: string, 
    uploadedBy: string, 
    uploadedById: string,
    associatedId?: string, 
    tags?: string[],
    uploadedByDisplay?: string  // Adding this optional parameter
  ): Promise<FileMetadata> {
    return new Promise((resolve, reject) => {
      try {
        const fileReader = new FileReader();
        
        fileReader.onload = () => {
          try {
            const id = uuidv4();
            const fileType = this.getFileType(file.type);
            const url = URL.createObjectURL(file);
            
            // Create file metadata
            const metadata: FileMetadata = {
              id,
              name: file.name,
              size: file.size,
              type: file.type,
              fileType,
              url,
              uploadedBy: uploadedByDisplay || uploadedBy, // Use the display name if provided
              uploadedById,
              uploadDate: new Date().toISOString(),
              category,
              associatedId,
              tags
            };
            
            // Store file data
            this.fileStorage.set(id, metadata);
            this.fileDataStorage.set(id, file);
            
            console.log(`File uploaded: ${file.name} (${id})`);
            resolve(metadata);
          } catch (error) {
            reject(error);
          }
        };
        
        fileReader.onerror = () => {
          reject(new Error('Failed to read file'));
        };
        
        fileReader.readAsArrayBuffer(file);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Download a file
  public async downloadFile(id: string): Promise<void> {
    try {
      const metadata = this.fileStorage.get(id);
      const fileData = this.fileDataStorage.get(id);
      
      if (!metadata || !fileData) {
        throw new Error('File not found');
      }
      
      // Create a download link and trigger download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(fileData);
      link.download = metadata.name;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      
      console.log(`File downloaded: ${metadata.name} (${id})`);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }
  
  // Get file metadata by ID
  public getFile(id: string): FileMetadata | undefined {
    return this.fileStorage.get(id);
  }
  
  // Get all files
  public getAllFiles(): FileMetadata[] {
    return Array.from(this.fileStorage.values());
  }
  
  // Get files by category
  public getFilesByCategory(category: string): FileMetadata[] {
    return Array.from(this.fileStorage.values())
      .filter(file => file.category === category);
  }
  
  // Get files by associated ID
  public getFilesByAssociatedId(associatedId: string): FileMetadata[] {
    return Array.from(this.fileStorage.values())
      .filter(file => file.associatedId === associatedId);
  }
  
  // Delete a file
  public deleteFile(id: string): boolean {
    try {
      const metadata = this.fileStorage.get(id);
      
      if (!metadata) {
        return false;
      }
      
      this.fileStorage.delete(id);
      this.fileDataStorage.delete(id);
      
      console.log(`File deleted: ${metadata.name} (${id})`);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
  
  // Update file metadata
  public updateFileMetadata(id: string, updates: Partial<FileMetadata>): FileMetadata | undefined {
    try {
      const metadata = this.fileStorage.get(id);
      
      if (!metadata) {
        return undefined;
      }
      
      // Don't allow updating these properties
      const { id: _, url: __, ...allowedUpdates } = updates;
      
      const updatedMetadata = {
        ...metadata,
        ...allowedUpdates
      };
      
      this.fileStorage.set(id, updatedMetadata);
      
      console.log(`File metadata updated: ${metadata.name} (${id})`);
      return updatedMetadata;
    } catch (error) {
      console.error('Error updating file metadata:', error);
      return undefined;
    }
  }
  
  // Determine file type based on MIME type
  private getFileType(mimeType: string): FileType {
    if (mimeType.startsWith('image/')) {
      return 'image';
    } else if (mimeType === 'application/pdf') {
      return 'pdf';
    } else if (
      mimeType === 'application/msword' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/vnd.ms-excel' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      mimeType === 'application/vnd.ms-powerpoint' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      mimeType === 'text/plain'
    ) {
      return 'document';
    } else {
      return 'other';
    }
  }
  
  // For demo purposes - simulate persisting data
  public persistData(): void {
    try {
      // Convert Map to object for serialization
      const filesMetadata = Array.from(this.fileStorage.entries());
      localStorage.setItem('filesMetadata', JSON.stringify(filesMetadata));
      console.log('File metadata persisted to localStorage');
      
      // Note: We can't actually persist the file data in localStorage due to size limitations
      // In a real app, this would be stored in a database
      console.log('File data would be persisted to database in a real app');
    } catch (error) {
      console.error('Error persisting file data:', error);
    }
  }
  
  // For demo purposes - simulate loading persisted data
  public loadPersistedData(): void {
    try {
      const filesMetadataJson = localStorage.getItem('filesMetadata');
      
      if (filesMetadataJson) {
        const filesMetadata = JSON.parse(filesMetadataJson);
        
        for (const [id, metadata] of filesMetadata) {
          this.fileStorage.set(id, metadata);
        }
        
        console.log('File metadata loaded from localStorage');
      }
    } catch (error) {
      console.error('Error loading persisted file data:', error);
    }
  }
}

export default FileStorageService;

// React hook to use the file storage service
export const useFileStorage = () => {
  const fileService = FileStorageService.getInstance();
  const { toast } = useToast();
  
  return {
    uploadFile: async (
      file: File,
      category: string,
      uploadedBy: string,
      uploadedById: string,
      associatedId?: string,
      tags?: string[],
      uploadedByDisplay?: string  // Add the optional parameter here as well
    ) => {
      try {
        const metadata = await fileService.uploadFile(
          file, 
          category, 
          uploadedBy, 
          uploadedById, 
          associatedId, 
          tags,
          uploadedByDisplay  // Pass the display name to the service
        );
        
        toast({
          title: "File Uploaded",
          description: `${file.name} has been successfully uploaded.`,
        });
        
        return metadata;
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}.`,
          variant: "destructive",
        });
        throw error;
      }
    },
    
    downloadFile: async (id: string) => {
      try {
        await fileService.downloadFile(id);
        
        const metadata = fileService.getFile(id);
        
        if (metadata) {
          toast({
            title: "Download Started",
            description: `${metadata.name} is being downloaded.`,
          });
        }
      } catch (error) {
        toast({
          title: "Download Failed",
          description: "Failed to download the file.",
          variant: "destructive",
        });
        throw error;
      }
    },
    
    getFile: fileService.getFile.bind(fileService),
    getAllFiles: fileService.getAllFiles.bind(fileService),
    getFilesByCategory: fileService.getFilesByCategory.bind(fileService),
    getFilesByAssociatedId: fileService.getFilesByAssociatedId.bind(fileService),
    deleteFile: fileService.deleteFile.bind(fileService),
    updateFileMetadata: fileService.updateFileMetadata.bind(fileService),
  };
};
