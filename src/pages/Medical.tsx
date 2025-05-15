
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicalProvider } from '@/contexts/MedicalContext';
import MedicalProvidersList from '@/components/admin/medical/MedicalProvidersList';
import MedicalRecordsList from '@/components/admin/medical/MedicalRecordsList';
import { Building2, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AdminMedicalView from '@/components/admin/medical/AdminMedicalView';

const Medical: React.FC = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  return (
    <PageLayout>
      <Helmet>
        <title>Medical Records - Law EMR</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Medical Records</h1>
          <p className="text-muted-foreground mt-1">
            Manage medical records, providers, and insurance claims
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <MedicalProvider>
            {isAdmin ? (
              <AdminMedicalView />
            ) : (
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold">Medical Management</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <Tabs defaultValue="providers">
                    <TabsList className="mb-4">
                      <TabsTrigger value="providers" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Providers
                      </TabsTrigger>
                      <TabsTrigger value="records" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Medical Records
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="providers">
                      <MedicalProvidersList />
                    </TabsContent>
                    
                    <TabsContent value="records">
                      <MedicalRecordsList />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </MedicalProvider>
        </div>
      </div>
    </PageLayout>
  );
};

export default Medical;
