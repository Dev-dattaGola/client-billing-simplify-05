
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from '@/types/client';

interface ClientDetailsProps {
  client: Client;
  onBack: () => void;
  onEdit: () => void;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({
  client,
  onBack,
  onEdit
}) => {
  // Fix: Convert the event handler to accept React.MouseEvent
  const handleBack = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    onBack();
  }, [onBack]);

  const handleEdit = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    onEdit();
  }, [onEdit]);

  return (
    <Card className="overflow-hidden glass-card">
      <CardHeader className="backdrop-blur-lg border-b p-6 border-white/20">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl text-white">{client.fullName}</CardTitle>
            <p className="text-sm text-white/60 mt-1">
              Client ID: {client.id}
              {client.accountNumber && ` | Account: ${client.accountNumber}`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleEdit}>
              Edit
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3 text-white">Client Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-white/60">Name</p>
                <p className="text-white">{client.fullName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-white/60">Email</p>
                <p className="text-white">{client.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-white/60">Phone</p>
                <p className="text-white">{client.phone}</p>
              </div>
              {client.companyName && (
                <div>
                  <p className="text-sm font-medium text-white/60">Company</p>
                  <p className="text-white">{client.companyName}</p>
                </div>
              )}
              {client.address && (
                <div>
                  <p className="text-sm font-medium text-white/60">Address</p>
                  <p className="whitespace-pre-wrap text-white">{client.address}</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3 text-white">Case Details</h3>
            <div className="space-y-3">
              {client.dateOfBirth && (
                <div>
                  <p className="text-sm font-medium text-white/60">Date of Birth</p>
                  <p className="text-white">{client.dateOfBirth}</p>
                </div>
              )}
              {client.caseStatus && (
                <div>
                  <p className="text-sm font-medium text-white/60">Case Status</p>
                  <p className="text-white">{client.caseStatus}</p>
                </div>
              )}
              {client.accidentDate && (
                <div>
                  <p className="text-sm font-medium text-white/60">Accident Date</p>
                  <p className="text-white">{client.accidentDate}</p>
                </div>
              )}
              {client.accidentLocation && (
                <div>
                  <p className="text-sm font-medium text-white/60">Accident Location</p>
                  <p className="text-white">{client.accidentLocation}</p>
                </div>
              )}
              {client.injuryType && (
                <div>
                  <p className="text-sm font-medium text-white/60">Injury Type</p>
                  <p className="text-white">{client.injuryType}</p>
                </div>
              )}
              {client.insuranceCompany && (
                <div>
                  <p className="text-sm font-medium text-white/60">Insurance Company</p>
                  <p className="text-white">{client.insuranceCompany}</p>
                </div>
              )}
              {client.insurancePolicyNumber && (
                <div>
                  <p className="text-sm font-medium text-white/60">Policy Number</p>
                  <p className="text-white">{client.insurancePolicyNumber}</p>
                </div>
              )}
            </div>
          </div>
          
          {client.caseDescription && (
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-medium mb-3 text-white">Case Description</h3>
              <p className="whitespace-pre-wrap text-white">{client.caseDescription}</p>
            </div>
          )}
          
          {client.notes && (
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-medium mb-3 text-white">Notes</h3>
              <p className="whitespace-pre-wrap text-white">{client.notes}</p>
            </div>
          )}
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-medium mb-3 text-white">Record Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-white/60">Created On</p>
                <p className="text-white">{new Date(client.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-white/60">Last Updated</p>
                <p className="text-white">{new Date(client.updatedAt).toLocaleDateString()}</p>
              </div>
              {client.tags && client.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-white/60">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {client.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-white/10 text-white text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(ClientDetails);
