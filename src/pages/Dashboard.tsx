
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Folder, FileText, CalendarDays, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Import components based on user role
const ClientDashboard = React.lazy(() => import('@/components/dashboard/ClientDashboard'));
const AttorneyDashboard = React.lazy(() => import('@/components/dashboard/AttorneyDashboard'));
const AdminDashboard = React.lazy(() => import('@/components/dashboard/AdminDashboard'));

const Dashboard: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();

  // Mock upcoming events and meetings
  const upcomingEvents = [
    { 
      id: '1', 
      title: 'Court Hearing - Smith vs. Jones', 
      type: 'hearing',
      date: '2023-06-15', 
      time: '10:00 AM', 
      client: 'John Smith',
      attorney: 'Sarah Johnson',
      location: 'Courtroom 302, County Courthouse'
    },
    { 
      id: '2', 
      title: 'Client Meeting - Estate Planning', 
      type: 'meeting',
      date: '2023-06-14', 
      time: '2:30 PM', 
      client: 'Mary Wilson',
      attorney: 'Robert Lee',
      location: 'Conference Room A'
    },
    { 
      id: '3', 
      title: 'Deposition - Brown Accident Case', 
      type: 'deposition',
      date: '2023-06-18', 
      time: '1:00 PM', 
      client: 'Michael Brown',
      attorney: 'Sarah Johnson',
      location: 'Office 501'
    },
    { 
      id: '4', 
      title: 'Settlement Conference', 
      type: 'settlement',
      date: '2023-06-17', 
      time: '11:30 AM', 
      client: 'Linda Martinez',
      attorney: 'Sarah Johnson',
      location: 'Mediation Center'
    },
    { 
      id: '5', 
      title: 'Document Review Meeting', 
      type: 'meeting',
      date: '2023-06-16', 
      time: '9:00 AM', 
      client: 'David Garcia',
      attorney: 'Robert Lee',
      location: 'Conference Room B'
    }
  ];

  // Choose dashboard component based on user role
  const getDashboardForRole = () => {
    if (!currentUser) return <DefaultDashboard events={upcomingEvents} />;
    
    switch (currentUser.role) {
      case 'superadmin':
      case 'admin':
        return <AdminDashboard />;
      case 'attorney':
        return <AttorneyDashboard />;
      case 'client':
        return <ClientDashboard />;
      default:
        return <DefaultDashboard events={upcomingEvents} />;
    }
  };

  return (
    <PageLayout>
      <Helmet>
        <title>Dashboard | Lawerp500</title>
      </Helmet>
      
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        {isAuthenticated ? (
          <>
            {getDashboardForRole()}
            
            {/* Show upcoming events section for admin and attorney users */}
            {currentUser && ['admin', 'attorney'].includes(currentUser.role) && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Upcoming Events & Meetings
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingEvents.map(event => (
                    <Card key={event.id} className="overflow-hidden">
                      <div className={`h-2 ${
                        event.type === 'hearing' ? 'bg-red-500' : 
                        event.type === 'meeting' ? 'bg-blue-500' : 
                        event.type === 'deposition' ? 'bg-purple-500' : 
                        'bg-green-500'
                      }`} />
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{event.title}</CardTitle>
                          <Badge className={
                            event.type === 'hearing' ? 'bg-red-100 text-red-800' : 
                            event.type === 'meeting' ? 'bg-blue-100 text-blue-800' : 
                            event.type === 'deposition' ? 'bg-purple-100 text-purple-800' : 
                            'bg-green-100 text-green-800'
                          }>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm space-y-2">
                          <div className="flex items-center">
                            <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-start">
                            <Users className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                            <div>
                              <div>Client: {event.client}</div>
                              <div>Attorney: {event.attorney}</div>
                            </div>
                          </div>
                          <div className="text-muted-foreground text-xs mt-2">
                            Location: {event.location}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Please log in</CardTitle>
            </CardHeader>
            <CardContent>
              <p>You need to log in to view your dashboard.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

// Fallback dashboard for users without a specific role
interface DefaultDashboardProps {
  events: any[];
}

const DefaultDashboard: React.FC<DefaultDashboardProps> = ({ events }) => {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Lawerp500</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is your personal dashboard. Contact your administrator if you need help.</p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="mr-2 h-4 w-4" /> Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Folder className="mr-2 h-4 w-4" /> Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="mr-2 h-4 w-4" /> Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CalendarDays className="mr-2 h-4 w-4" /> Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
