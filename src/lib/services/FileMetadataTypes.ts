
// Type definitions for file metadata used in the application
export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadDate: string;
  lastModified: string;
  category?: string;
  createdAt?: string; // Added to match usage in FileManagement.tsx
  fileType?: string; // Added to match FileStorageService.ts
  uploadedBy?: string; // Added to match FileStorageService.ts
  uploadedById?: string; // Added to match FileStorageService.ts
  tags?: string[]; // Add optional tags field
  associatedId?: string; // Added for associating with clients/cases
}
