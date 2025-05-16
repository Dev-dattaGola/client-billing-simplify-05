
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Calendar, Bell, AlertCircle, FileText, Clock } from 'lucide-react';
import PatientDashboardHeader from './PatientDashboardHeader';
import PatientAttorneyChat from './PatientAttorneyChat';
import { useAuth } from '@/contexts/AuthContext';

const PatientsDashboard: React.FC = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  
  // Mock client data
  const mockClient = {
    id: "P123",
    accountNumber: "A042",
    fullName: "John Doe",
    email: "john@example.com",
    phone: "555-0123",
    createdAt: "2025-04-01",
    updatedAt: "2025-04-20"
  };

  const handleChatInitiated = () => {
    setIsChatVisible(true);
  };

  return (
    <div className="space-y-6">
      <PatientDashboardHeader 
        client={mockClient}
        caseStatus="Active Treatment"
        lastUpdated="April 20, 2025"
        onChatInitiated={handleChatInitiated}
        isAdmin={isAdmin}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Case Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge className="bg-yellow-500 hover:bg-yellow-600">Active Treatment</Badge>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Last Updated: April 20, 2025
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assigned Attorney</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://i.pravatar.cc/100?img=33" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">Jane Doelawyer</p>
                <p className="text-xs text-muted-foreground">Personal Injury Specialist</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Follow-up Consultation</p>
                <p className="text-xs text-muted-foreground">May 10, 2025 - 10:30 AM</p>
              </div>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <PatientAttorneyChat 
        client={mockClient} 
        isVisible={isChatVisible}
      />

      <Card>
        <CardHeader>
          <CardTitle>Recent Updates</CardTitle>
          <CardDescription>Latest activities on your case</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="mr-4 mt-0.5">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Medical records submitted</p>
                <p className="text-xs text-muted-foreground">April 18, 2025</p>
                <p className="text-sm mt-1">Your physical therapy records from City Rehab Center have been submitted to the insurance company.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-4 mt-0.5">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Insurance claim acknowledged</p>
                <p className="text-xs text-muted-foreground">April 12, 2025</p>
                <p className="text-sm mt-1">ABC Insurance has acknowledged receipt of your claim. Claim #123456.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-4 mt-0.5">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Case opened</p>
                <p className="text-xs text-muted-foreground">April 5, 2025</p>
                <p className="text-sm mt-1">Your case has been opened and assigned to attorney Jane Doelawyer.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-amber-50 border-amber-200">
        <CardHeader className="pb-2">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
            <CardTitle className="text-sm font-medium text-amber-800">Smart Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start">
              <Bell className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
              <p className="text-sm text-amber-800">You missed your physical therapy appointment on April 15, 2025. Please reschedule as soon as possible.</p>
            </div>
            <div className="flex items-start">
              <Bell className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
              <p className="text-sm text-amber-800">It's been 14 days since your last treatment. Please follow up with your provider.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsDashboard;
