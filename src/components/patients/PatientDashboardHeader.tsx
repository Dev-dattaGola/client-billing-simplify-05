
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExternalLink, User, MessageCircle } from 'lucide-react';
import { Client } from '@/types/client';
import { useToast } from '@/hooks/use-toast';
import { messagingApi } from '@/backend';

interface PatientDashboardHeaderProps {
  client?: Client;
  caseStatus: string;
  lastUpdated: string;
  onChatInitiated: () => void;
}

const PatientDashboardHeader: React.FC<PatientDashboardHeaderProps> = ({
  client,
  caseStatus,
  lastUpdated,
  onChatInitiated
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

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

  return (
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
          <div className="w-full sm:w-auto">
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
  );
};

export default PatientDashboardHeader;
