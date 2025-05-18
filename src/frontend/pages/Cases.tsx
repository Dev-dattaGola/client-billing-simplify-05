
import PageLayout from "@/frontend/components/layout/PageLayout";
import CaseManagement from "@/components/case-management/CaseManagement";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';

const Cases = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Case Management - LAW ERP 500</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <Card className="glass-card backdrop-blur-lg border border-white/20 shadow-lg overflow-hidden rounded-xl mb-6">
          <CardHeader className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 pb-8 border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-2xl text-white">
              Case Management System
            </CardTitle>
            <CardDescription className="text-white/70">
              View, add, edit and manage all your legal cases
            </CardDescription>
          </CardHeader>
        </Card>
        
        <div className="max-w-7xl mx-auto">
          <CaseManagement />
        </div>
      </div>
      
      <footer className="px-4 py-6 border-t border-white/20 text-sm text-white/60">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">LAWerp500</span> | Case Management
          </div>
          <div className="text-sm">© 2025 LAWerp500. All rights reserved.</div>
        </div>
      </footer>
    </PageLayout>
  );
};

export default Cases;
