import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Calendar, FileText, Phone, Mail, MapPin, Clock, Activity, User } from "lucide-react";
import { Client } from "@/types/client";
import { clientsApi, Appointment, Document } from "@/lib/api/client-api";
import { useToast } from "@/hooks/use-toast";

interface ClientDetailsProps {
  client: Client;
  onBack: () => void;
  onEdit: () => void;
  onDrop?: () => void;
  onTransfer?: () => void;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ client, onBack, onEdit, onDrop, onTransfer }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const [appointmentsData, documentsData] = await Promise.all([
          clientsApi.getAppointments(client.id),
          clientsApi.getDocuments(client.id)
        ]);

        setAppointments(appointmentsData);
        setDocuments(documentsData);
      } catch (error) {
        console.error('Error fetching client data:', error);
        toast({
          title: "Error",
          description: "Failed to load client data. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchClientData();
  }, [client.id, toast]);

  const getCaseStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('active') && !statusLower.includes('inactive')) return "bg-green-100 text-green-800";
    if (statusLower.includes('closed') || statusLower.includes('inactive')) return "bg-red-100 text-red-800";
    if (statusLower.includes('review') || statusLower.includes('consultation')) return "bg-blue-100 text-blue-800";
    if (statusLower.includes('negotiation')) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  const getAppointmentStatusColor = (status: 'completed' | 'missed' | 'scheduled') => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'missed': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Client Info Card */}
        <Card className="md:w-1/3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={client.profilePhoto || `https://i.pravatar.cc/100?u=${client.id}`} />
                  <AvatarFallback className="bg-purple-100 text-purple-800 text-xl font-semibold">
                    {client.fullName.split(' ').map(name => name[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{client.fullName}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <span className="text-sm font-medium mr-1">Account #:</span>
                    <span>{client.accountNumber || `A${client.id.substring(0, 3)}`}</span>
                  </CardDescription>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Badge className={getCaseStatusColor(client.caseStatus)}>
                {client.caseStatus || "No Status"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Date of Birth:</span>
                <span className="ml-auto font-medium">{client.dateOfBirth || 'Not provided'}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Phone:</span>
                <span className="ml-auto font-medium">{client.phone}</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span className="ml-auto font-medium">{client.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Address:</span>
                <span className="ml-auto font-medium">{client.address || 'Not provided'}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Registered:</span>
                <span className="ml-auto font-medium">{client.dateRegistered || client.createdAt?.split('T')[0] || 'Not provided'}</span>
              </div>
              {client.companyName && (
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Company:</span>
                  <span className="ml-auto font-medium">{client.companyName}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Accident Information</h3>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Date:</span>
                <span className="ml-auto font-medium">{client.accidentDate || 'N/A'}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Location:</span>
                <span className="ml-auto font-medium truncate max-w-[150px]" title={client.accidentLocation}>
                  {client.accidentLocation || 'N/A'}
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Insurance Information</h3>
              <div className="flex items-center text-sm">
                <span className="text-muted-foreground">Company:</span>
                <span className="ml-auto font-medium">{client.insuranceCompany || 'N/A'}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-muted-foreground">Policy #:</span>
                <span className="ml-auto font-medium">{client.insurancePolicyNumber || 'N/A'}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-muted-foreground">Adjuster:</span>
                <span className="ml-auto font-medium">{client.insuranceAdjusterName || 'N/A'}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              Back to List
            </Button>
            <Button onClick={onEdit}>
              Edit Client
            </Button>
          </CardFooter>
        </Card>

        {/* Detail Tabs */}
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Case Overview</CardTitle>
                  <CardDescription>Summary of the client's injury case</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Injury Type</h4>
                      <p className="text-sm text-muted-foreground">{client.injuryType || 'Not specified'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Case Description</h4>
                      <p className="text-sm text-muted-foreground">{client.caseDescription || 'No description available'}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-1">Assigned Attorney</h4>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>JS</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">Jane Smith</p>
                          <p className="text-xs text-muted-foreground">Personal Injury Specialist</p>
                        </div>
                      </div>
                    </div>
                    
                    {client.notes && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Notes</h4>
                        <p className="text-sm text-muted-foreground">{client.notes}</p>
                      </div>
                    )}
                    
                    {client.tags && client.tags.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Tags</h4>
                        <div className="flex flex-wrap gap-1">
                          {client.tags.map(tag => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 border-amber-200">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
                    <CardTitle className="text-sm font-medium text-amber-800">Notifications</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {appointments.some(apt => apt.visitStatus === 'missed') && (
                      <div className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
                        <p className="text-sm text-amber-800">Client has missed appointments that need to be rescheduled.</p>
                      </div>
                    )}
                    
                    {client.caseStatus === 'Active Treatment' && (
                      <div className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
                        <p className="text-sm text-amber-800">Treatment in progress. Regular follow-ups required.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appointments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appointments History</CardTitle>
                  <CardDescription>Past and upcoming appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  {appointments.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No appointments found for this client.</p>
                  ) : (
                    <div className="space-y-4">
                      {appointments.sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
                        .map((appointment) => (
                          <div key={appointment.id} className="flex items-start space-x-4 p-4 rounded-md border">
                            <div className={`p-2 rounded-full ${
                              appointment.visitStatus === 'completed' ? 'bg-green-100' :
                              appointment.visitStatus === 'missed' ? 'bg-red-100' : 'bg-blue-100'
                            }`}>
                              <Calendar className={`h-5 w-5 ${
                                appointment.visitStatus === 'completed' ? 'text-green-600' :
                                appointment.visitStatus === 'missed' ? 'text-red-600' : 'text-blue-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-medium">{appointment.doctorFacilityName}</h3>
                                <Badge className={getAppointmentStatusColor(appointment.visitStatus)}>
                                  {appointment.visitStatus.charAt(0).toUpperCase() + appointment.visitStatus.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{appointment.type}</p>
                              <div className="flex items-center mt-1">
                                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span className="text-sm">{appointment.visitDate}</span>
                                <Clock className="h-4 w-4 ml-3 mr-1 text-muted-foreground" />
                                <span className="text-sm">{appointment.visitTime}</span>
                              </div>
                              <p className="text-sm mt-2">{appointment.treatmentDescription || 'No description available'}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Client Documents</CardTitle>
                  <CardDescription>Medical records, legal documents, and more</CardDescription>
                </CardHeader>
                <CardContent>
                  {documents.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No documents found for this client.</p>
                  ) : (
                    <div className="space-y-2">
                      {documents.map((document) => (
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
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
