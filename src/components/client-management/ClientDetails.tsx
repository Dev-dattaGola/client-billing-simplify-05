import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Trash2, Users, Calendar, FileText, MessageCircle, Phone } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import ClientForm from './ClientForm';
import ClientAppointments from './ClientAppointments';
import ClientDocuments from './ClientDocuments';
import ClientCaseReport from './ClientCaseReport';
import ClientCommunication from './ClientCommunication';
import ClientMedicalRecords from './ClientMedicalRecords';
import { useToast } from '@/hooks/use-toast';
import { useNavigationTracking } from '@/hooks/use-navigation-tracking';
import { Client } from '@/types/client';

// Mock function to fetch client by ID - would be replaced with actual API call
const fetchClientById = async (id: string): Promise<Client> => {
  // This would be an API call in a real app
  // For now, return mock data
  return {
    id,
    fullName: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    companyName: "Acme Inc",
    address: "123 Main St, Anytown, CA 90210",
    tags: ["personal injury", "active"],
    notes: "Client involved in a car accident on March 15, 2023.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    caseStatus: "Active Treatment",
    assignedAttorneyId: "attorney1",
  };
};

// Mock function to update client - would be replaced with actual API call
const updateClient = async (client: Client): Promise<Client> => {
  // This would be an API call in a real app
  // For now, just return the client with updated timestamp
  return {
    ...client,
    updatedAt: new Date().toISOString(),
  };
};

// Mock function to delete client - would be replaced with actual API call
const deleteClient = async (id: string): Promise<void> => {
  // This would be an API call in a real app
  console.log(`Deleting client with ID: ${id}`);
  return Promise.resolve();
};

const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { goBack } = useNavigationTracking();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Check if user is admin (in a real app this would be from auth context)
  const isAdmin = true; // This should come from authentication in a real app

  useEffect(() => {
    const loadClient = async () => {
      if (id) {
        try {
          const data = await fetchClientById(id);
          setClient(data);
        } catch (error) {
          console.error('Error loading client:', error);
          toast({
            title: "Error",
            description: "Failed to load client details.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadClient();
  }, [id, toast]);

  const handleUpdateClient = async (updatedClient: Client) => {
    try {
      const updated = await updateClient(updatedClient);
      setClient(updated);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Client information has been updated.",
      });
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: "Error",
        description: "Failed to update client information.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClient = async () => {
    if (!client) return;
    
    try {
      await deleteClient(client.id);
      toast({
        title: "Success",
        description: "Client has been deleted successfully.",
      });
      navigate('/clients');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Error",
        description: "Failed to delete client.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-40" />
        </div>
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Client Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The client you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/clients')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Client List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Back button and client name */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={(e) => goBack()} 
            className="mr-2 p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{client?.fullName}</h1>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Client
          </Button>
          
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Client
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the client 
                  {client.fullName} and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteClient} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      {/* Client information card */}
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>Basic information and contact details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="font-medium">{client.fullName}</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 text-muted-foreground mr-2" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                  <span>{client.phone}</span>
                </div>
                {client.address && (
                  <div className="flex">
                    <div className="mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground mr-2">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <span>{client.address}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Client Details</h3>
              <div className="space-y-2">
                {client.companyName && (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground mr-2">
                      <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
                      <path d="M1 21h22" />
                      <path d="M10 9h4" />
                      <path d="M10 13h4" />
                      <path d="M10 17h4" />
                    </svg>
                    <span>{client.companyName}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                  <span>Client since {new Date(client.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-muted-foreground mr-2" />
                  <span>Case Status: <span className="font-medium">{client.caseStatus || "Not specified"}</span></span>
                </div>
                
                <div>
                  <div className="flex items-center mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground mr-2">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    </svg>
                    <span>Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {client.tags?.map(tag => (
                      <div key={tag} className="bg-secondary text-secondary-foreground text-xs px-2.5 py-0.5 rounded-full">
                        {tag}
                      </div>
                    ))}
                    {!client.tags?.length && <span className="text-sm text-muted-foreground">No tags</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {client.notes && (
            <>
              <Separator className="my-4" />
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Notes</h3>
                <p className="text-sm">{client.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Client details tabs */}
      <Tabs defaultValue="cases" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="cases">Case Info</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="medical">Medical Records</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cases">
          <Card>
            <CardContent className="pt-6">
              <ClientCaseReport clientId={client.id} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appointments">
          <Card>
            <CardContent className="pt-6">
              <ClientAppointments clientId={client.id} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardContent className="pt-6">
              <ClientDocuments clientId={client.id} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="medical">
          <Card>
            <CardContent className="pt-6">
              <ClientMedicalRecords clientId={client.id} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="communication">
          <Card>
            <CardContent className="pt-6">
              <ClientCommunication clientId={client.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Edit client side sheet */}
      <Sheet open={isEditing} onOpenChange={setIsEditing}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Client</SheetTitle>
            <SheetDescription>Make changes to the client information.</SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <ClientForm 
              initialData={client} 
              onSubmit={handleUpdateClient} 
              onCancel={() => setIsEditing(false)} 
              isAdmin={isAdmin}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ClientDetails;
