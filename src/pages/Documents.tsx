
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Download, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Documents = () => {
  const { currentUser } = useAuth();

  // Mock document data - in a real app this would come from an API
  const documents = [
    { id: 1, name: 'Client Agreement.pdf', uploadedBy: 'John Doe', date: '2023-05-15', size: '2.4 MB' },
    { id: 2, name: 'Case Summary.docx', uploadedBy: 'Sarah Smith', date: '2023-05-14', size: '1.1 MB' },
    { id: 3, name: 'Court Filing.pdf', uploadedBy: 'Michael Johnson', date: '2023-05-13', size: '3.7 MB' },
    { id: 4, name: 'Medical Records.pdf', uploadedBy: 'John Doe', date: '2023-05-12', size: '8.2 MB' },
    { id: 5, name: 'Financial Statement.xlsx', uploadedBy: 'Sarah Smith', date: '2023-05-10', size: '0.9 MB' },
  ];

  return (
    <PageLayout>
      <Helmet>
        <title>Documents - Lawerp500</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Documents</h1>
            <p className="text-muted-foreground">
              Manage and access all your case-related documents
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documents..."
                className="w-full pl-8 md:w-[250px]"
              />
            </div>
            
            <Button className="flex items-center gap-1">
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Recent Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Uploaded By</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Size</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-blue-500" />
                          {doc.name}
                        </div>
                      </td>
                      <td className="py-3 px-4">{doc.uploadedBy}</td>
                      <td className="py-3 px-4">{doc.date}</td>
                      <td className="py-3 px-4">{doc.size}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" title="Download">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Documents;
