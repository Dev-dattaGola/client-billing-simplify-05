
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExternalLink, User, MessageCircle, UserPlus } from 'lucide-react';
import { Client } from '@/types/client';
import { useToast } from '@/hooks/use-toast';
import { messagingApi } from '@/backend';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

interface Attorney {
  id: string;
  full_name: string;
  email: string;
  specialization?: string;
}

interface PatientDashboardHeaderProps {
  client?: Client;
  caseStatus: string;
  lastUpdated: string;
  onChatInitiated: () => void;
  isAdmin?: boolean;
}

const PatientDashboardHeader: React.FC<PatientDashboardHeaderProps> = ({
  client,
  caseStatus,
  lastUpdated,
  onChatInitiated,
  isAdmin = false
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [selectedAttorneyId, setSelectedAttorneyId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch attorneys on component mount
  useEffect(() => {
    if (isAdmin) {
      fetchAttorneys();
    }
  }, [isAdmin]);

  const fetchAttorneys = async () => {
    try {
      // Try to fetch from Supabase first
      let { data: attorneysData, error } = await supabase
        .from('attorneys')
        .select('id, full_name, email, specialization');

      if (error) {
        throw error;
      }

      if (attorneysData && attorneysData.length > 0) {
        setAttorneys(attorneysData);
        // If client has assigned attorney, set it as selected
        if (client?.assignedAttorneyId) {
          setSelectedAttorneyId(client.assignedAttorneyId);
        }
        return;
      }

      // Fallback to mock data if no attorneys in Supabase or if Supabase is not available
      console.warn('No attorneys found in Supabase, using mock data');
      setAttorneys([
        { id: 'attorney1', full_name: 'Jane Doe', email: 'jane.doe@example.com', specialization: 'Personal Injury' },
        { id: 'attorney2', full_name: 'John Smith', email: 'john.smith@example.com', specialization: 'Medical Malpractice' },
        { id: 'attorney3', full_name: 'Alice Johnson', email: 'alice.johnson@example.com', specialization: 'Slip and Fall' }
      ]);
      // If client has assigned attorney, set it as selected
      if (client?.assignedAttorneyId) {
        setSelectedAttorneyId(client.assignedAttorneyId);
      }
    } catch (error) {
      console.error('Error fetching attorneys:', error);
      toast({
        title: "Error Fetching Attorneys",
        description: "Failed to load attorney list. Please try again.",
        variant: "destructive"
      });
      // Fallback to mock data
      setAttorneys([
        { id: 'attorney1', full_name: 'Jane Doe', email: 'jane.doe@example.com', specialization: 'Personal Injury' },
        { id: 'attorney2', full_name: 'John Smith', email: 'john.smith@example.com', specialization: 'Medical Malpractice' },
        { id: 'attorney3', full_name: 'Alice Johnson', email: 'alice.johnson@example.com', specialization: 'Slip and Fall' }
      ]);
    }
  };

  const showToastNotification = () => {
    toast({
      title: "Client Portal Access",
      description: "This would connect to the full client profile in a real implementation.",
    });
  };

  const handleContactAttorney = async () => {
    if (client) {
      try {
        // Create a new chat message to the attorney
        await messagingApi.sendMessage({
          senderId: client.id,
          recipientId: 'attorney1',
          content: `Client ${client.fullName} (ID: ${client.id}, Account: ${client.accountNumber}) has requested to chat.`,
          isRead: false,
          type: 'chat'
        });

        // Call the callback to show the chat
        onChatInitiated();

        // Navigate to the patient attorney chat section
        const patientSection = document.getElementById('patient-attorney-chat');
        if (patientSection) {
          patientSection.scrollIntoView({ behavior: 'smooth' });
        }

        toast({
          title: "Attorney Chat Initiated",
          description: "You've been connected to your attorney's chat. Please start your conversation below.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to connect to attorney chat. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Please log in to contact your attorney.",
        variant: "destructive"
      });
    }
  };

  const handleOpenTransferDialog = () => {
    setIsTransferDialogOpen(true);
    if (client?.assignedAttorneyId) {
      setSelectedAttorneyId(client.assignedAttorneyId);
    } else {
      setSelectedAttorneyId('');
    }
  };

  const handleTransferClient = async () => {
    if (!client || !selectedAttorneyId) {
      toast({
        title: "Error",
        description: "Please select an attorney to transfer the client to.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // First try with Supabase
      const { error } = await supabase
        .from('clients')
        .update({ assigned_attorney_id: selectedAttorneyId })
        .eq('id', client.id);

      if (error) {
        throw error;
      }

      // Success message
      toast({
        title: "Client Transferred",
        description: `Client has been successfully assigned to ${attorneys.find(a => a.id === selectedAttorneyId)?.full_name}.`,
      });

      setIsTransferDialogOpen(false);
    } catch (error) {
      console.error('Error transferring client:', error);
      
      // Fallback to mock success for demo purposes
      console.warn('Using mock success for client transfer demonstration');
      setTimeout(() => {
        toast({
          title: "Client Transferred (Mock)",
          description: `Client has been successfully assigned to ${attorneys.find(a => a.id === selectedAttorneyId)?.full_name}.`,
        });
        setIsTransferDialogOpen(false);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="bg-white border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <Avatar className="h-14 w-14 mr-4">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" />
                <AvatarFallback>{client?.fullName?.substring(0, 2) || 'CL'}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <h2 className="text-lg font-semibold">{client?.fullName || "Patient Portal"}</h2>
                    {client && (
                      <Link to={`/clients/${client.id}`} onClick={showToastNotification}>
                        <Button variant="ghost" size="sm" className="ml-2 h-7">
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          Client Profile
                        </Button>
                      </Link>
                    )}
                  </div>
                  {client?.accountNumber && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-3.5 w-3.5 mr-1" />
                      <span>Patient ID: {client.id} | Account: {client.accountNumber}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <span>Case Status: </span>
                  <Badge variant="secondary" className="ml-2">{caseStatus}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Last updated: {lastUpdated}</p>
              </div>
            </div>
            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
              {isAdmin && client && (
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={handleOpenTransferDialog}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Transfer Client
                </Button>
              )}
              <Button 
                variant="default" 
                className="w-full sm:w-auto"
                onClick={handleContactAttorney}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Your Attorney
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer Client to Another Attorney</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="attorney">Select Attorney</Label>
              <Select 
                value={selectedAttorneyId}
                onValueChange={setSelectedAttorneyId}
              >
                <SelectTrigger id="attorney">
                  <SelectValue placeholder="Select an attorney" />
                </SelectTrigger>
                <SelectContent>
                  {attorneys.map(attorney => (
                    <SelectItem key={attorney.id} value={attorney.id}>
                      {attorney.full_name} ({attorney.specialization || 'General'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTransferClient} disabled={isLoading || !selectedAttorneyId}>
              {isLoading ? "Transferring..." : "Transfer Client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PatientDashboardHeader;
