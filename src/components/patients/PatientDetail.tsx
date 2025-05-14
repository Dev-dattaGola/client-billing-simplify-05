
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Patient, Appointment, Document } from '@/backend/patients-api';
import { patientsApi } from '@/backend'; // Use patientsApi compatibility layer
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, FileText, Phone, Mail, Clock, MapPin, Activity, User, AlertCircle } from 'lucide-react';

const PatientDetail: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) return;
      
      setIsLoading(true);
      try {
        const [patientData, appointmentsData, documentsData] = await Promise.all([
          patientsApi.getPatient(patientId),
          patientsApi.getAppointments(patientId),
          patientsApi.getDocuments(patientId)
        ]);

        if (patientData) {
          setPatient(patientData);
          setAppointments(appointmentsData);
          setDocuments(documentsData);
        } else {
          toast({
            title: "Patient not found",
            description: "The requested patient could not be found.",
            variant: "destructive",
          });
          navigate("/patients/list");
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
        toast({
          title: "Error",
          description: "Failed to load patient data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId, navigate, toast]);

  const getStatusColor = (status: string) => {
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!patient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Patient Not Found</CardTitle>
          <CardDescription>The requested patient could not be found</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate("/patients/list")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Patient List
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => navigate("/patients/list")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Patient List
      </Button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Patient Info Card */}
        <Card className="md:w-1/3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={patient.profilePhoto || `https://i.pravatar.cc/100?u=${patient.id}`} />
                  <AvatarFallback className="bg-purple-100 text-purple-800 text-xl font-semibold">
                    {patient.fullName.split(' ').map(name => name[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{patient.fullName}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <span className="text-sm font-medium mr-1">Account #:</span>
                    <span>{patient.accountNumber}</span>
                  </CardDescription>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Badge className={getStatusColor(patient.caseStatus)}>
                {patient.caseStatus}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Date of Birth:</span>
                <span className="ml-auto font-medium">{patient.dateOfBirth}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Phone:</span>
                <span className="ml-auto font-medium">{patient.phone}</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span className="ml-auto font-medium">{patient.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Address:</span>
                <span className="ml-auto font-medium">{patient.address}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Registered:</span>
                <span className="ml-auto font-medium">{patient.dateRegistered}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Accident Information</h3>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Date:</span>
                <span className="ml-auto font-medium">{patient.accidentDate || 'N/A'}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Location:</span>
                <span className="ml-auto font-medium truncate max-w-[150px]" title={patient.accidentLocation}>
                  {patient.accidentLocation || 'N/A'}
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Insurance Information</h3>
              <div className="flex items-center text-sm">
                <span className="text-muted-foreground">Company:</span>
                <span className="ml-auto font-medium">{patient.insuranceCompany || 'N/A'}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-muted-foreground">Policy #:</span>
                <span className="ml-auto font-medium">{patient.insurancePolicyNumber || 'N/A'}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-muted-foreground">Adjuster:</span>
                <span className="ml-auto font-medium">{patient.insuranceAdjusterName || 'N/A'}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate(`/patients/case-report?id=${patient.id}`)}>
              <FileText className="mr-2 h-4 w-4" />
              Case Report
            </Button>
            <Button onClick={() => navigate(`/patients/medical-records?id=${patient.id}`)}>
              <Activity className="mr-2 h-4 w-4" />
              Medical Records
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
                  <CardDescription>Summary of the patient's injury case</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Injury Type</h4>
                      <p className="text-sm text-muted-foreground">{patient.injuryType || 'Not specified'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Case Description</h4>
                      <p className="text-sm text-muted-foreground">{patient.caseDescription || 'No description available'}</p>
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
                        <p className="text-sm text-amber-800">Patient has missed appointments that need to be rescheduled.</p>
                      </div>
                    )}
                    
                    {patient.caseStatus === 'Active Treatment' && (
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
                    <p className="text-center py-8 text-muted-foreground">No appointments found for this patient.</p>
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
                <CardFooter>
                  <Button className="w-full" onClick={() => navigate(`/patients/appointments?id=${patient.id}`)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    View All Appointments
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Documents</CardTitle>
                  <CardDescription>Medical records, legal documents, and more</CardDescription>
                </CardHeader>
                <CardContent>
                  {documents.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No documents found for this patient.</p>
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
                <CardFooter>
                  <Button className="w-full" onClick={() => navigate(`/patients/documents?id=${patient.id}`)}>
                    <FileText className="mr-2 h-4 w-4" />
                    View All Documents
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
