
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const AttorneyDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Welcome, {currentUser?.name || 'Attorney'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>View your case load, client information, and upcoming court dates.</p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You have no active cases.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You have no assigned clients.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Court Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You have no upcoming court dates.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttorneyDashboard;
