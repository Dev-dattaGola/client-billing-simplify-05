
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import PatientDashboardHeader from './PatientDashboardHeader';
import PatientAttorneyChat from './PatientAttorneyChat';
import PatientsAppointments from './PatientsAppointments';
import PatientsMedicalRecords from './PatientsMedicalRecords';
import PatientsLegalDocuments from './PatientsLegalDocuments';
import PatientsCaseReport from './PatientsCaseReport';
import { clientsApi } from '@/lib/api/client-api';
import { Client } from '@/types/client';

interface PatientsDashboardProps {
  clientId?: string;
  isAdmin?: boolean;
}

const PatientsDashboard: React.FC<PatientsDashboardProps> = ({ 
  clientId = 'client1',
  isAdmin = false
}) => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadClient = async () => {
      try {
        setIsLoading(true);
        const clientData = await clientsApi.getClient(clientId);
        setClient(clientData);
      } catch (error) {
        console.error('Error loading client data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load client information.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadClient();
  }, [clientId, toast]);

  const handleChatInitiated = () => {
    setIsChatOpen(true);
    setActiveTab('chat');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Helmet>
        <title>Patient Dashboard - LAW ERP 500</title>
      </Helmet>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <PatientDashboardHeader
            client={client || undefined}
            caseStatus={client?.caseStatus || 'Unknown'}
            lastUpdated={client?.updatedAt ? new Date(client.updatedAt).toLocaleDateString() : 'Unknown'}
            onChatInitiated={handleChatInitiated}
            isAdmin={isAdmin}
          />

          <div className="mt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="appointments">Appointments</TabsTrigger>
                  <TabsTrigger value="medical">Medical Records</TabsTrigger>
                  <TabsTrigger value="documents">Legal Documents</TabsTrigger>
                  <TabsTrigger value="case">Case Report</TabsTrigger>
                  <TabsTrigger value="chat" id="patient-attorney-chat">Attorney Chat</TabsTrigger>
                </TabsList>
              </div>

              <div className="mt-6">
                <TabsContent value="appointments" className="space-y-6">
                  <PatientsAppointments client={client} />
                </TabsContent>

                <TabsContent value="medical" className="space-y-6">
                  <PatientsMedicalRecords client={client} />
                </TabsContent>

                <TabsContent value="documents" className="space-y-6">
                  <PatientsLegalDocuments client={client} />
                </TabsContent>

                <TabsContent value="case" className="space-y-6">
                  <PatientsCaseReport client={client} />
                </TabsContent>

                <TabsContent value="chat" className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      {isChatOpen ? (
                        <PatientAttorneyChat client={client} />
                      ) : (
                        <div className="text-center py-12">
                          <h3 className="text-lg font-medium mb-2">Chat with your attorney</h3>
                          <p className="text-muted-foreground mb-4">
                            Connect with your assigned attorney to discuss your case.
                          </p>
                          <Button onClick={handleChatInitiated}>Start Chat</Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientsDashboard;
