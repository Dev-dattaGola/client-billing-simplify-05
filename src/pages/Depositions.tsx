
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DepositionProvider } from '@/contexts/DepositionContext';
import DepositionList from '@/components/admin/deposition/DepositionList';
import { useAuth } from '@/contexts/AuthContext';
import AdminDepositionList from '@/components/admin/deposition/AdminDepositionList';

const Depositions: React.FC = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  return (
    <PageLayout>
      <Helmet>
        <title>Depositions - Law EMR</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Depositions</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin 
              ? "View and manage all depositions across attorneys" 
              : "Schedule and manage depositions for your cases"}
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <DepositionProvider>
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold">
                  {isAdmin ? "All Depositions" : "Your Depositions"}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {isAdmin ? <AdminDepositionList /> : <DepositionList />}
              </CardContent>
            </Card>
          </DepositionProvider>
        </div>
      </div>
    </PageLayout>
  );
};

export default Depositions;
