
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
}
