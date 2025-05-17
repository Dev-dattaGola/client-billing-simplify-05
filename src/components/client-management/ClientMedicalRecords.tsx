
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { clientsApi, Document } from "@/lib/api/client-api";

interface ClientMedicalRecordsProps {
  clientId: string;
}

const ClientMedicalRecords: React.FC<ClientMedicalRecordsProps> = ({ clientId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        setLoading(true);
        const allDocuments = await clientsApi.getDocuments(clientId);
        const medicalDocs = allDocuments.filter(doc => doc.type === 'medical');
        setDocuments(medicalDocs);
      } catch (error) {
        console.error("Error fetching medical records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="glass-card backdrop-blur-lg border border-white/20">
      <CardHeader>
        <CardTitle>Medical Records</CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <p className="text-center py-8 text-white/70">No medical records found for this client.</p>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="border border-white/10 rounded-md p-4 hover:bg-white/5 transition-colors backdrop-blur-sm">
                <h3 className="font-medium text-white">{doc.name}</h3>
                <p className="text-sm text-white/70">{doc.category}</p>
                <div className="mt-1 text-sm text-white/80">
                  <span>Uploaded: {doc.uploadDate} by {doc.uploadedBy}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientMedicalRecords;
