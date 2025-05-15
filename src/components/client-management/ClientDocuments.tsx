
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, FileText } from "lucide-react";
import { clientsApi, Document } from "@/lib/api/client-api";
import { Badge } from '@/components/ui/badge';

interface ClientDocumentsProps {
  clientId: string;
}

const ClientDocuments: React.FC<ClientDocumentsProps> = ({ clientId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const docs = await clientsApi.getDocuments(clientId);
        setDocuments(docs);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredDocuments = activeTab === "all" 
    ? documents 
    : documents.filter(doc => doc.type === activeTab);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="misc">Misc</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {filteredDocuments.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No documents found in this category.</p>
            ) : (
              <div className="space-y-2">
                {filteredDocuments.map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-500" />
                      <div>
                        <p className="font-medium">{document.name}</p>
                        <p className="text-xs text-muted-foreground">{document.uploadDate} • {document.category} • Uploaded by: {document.uploadedBy}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {document.fileType.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClientDocuments;
