
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
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50 border-b p-6">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{client.fullName}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
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
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Client Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p>{client.fullName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{client.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p>{client.phone}</p>
              </div>
              {client.companyName && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Company</p>
                  <p>{client.companyName}</p>
                </div>
              )}
              {client.address && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="whitespace-pre-wrap">{client.address}</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Case Details</h3>
            <div className="space-y-3">
              {client.dateOfBirth && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p>{client.dateOfBirth}</p>
                </div>
              )}
              {client.caseStatus && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Case Status</p>
                  <p>{client.caseStatus}</p>
                </div>
              )}
              {client.accidentDate && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Accident Date</p>
                  <p>{client.accidentDate}</p>
                </div>
              )}
              {client.accidentLocation && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Accident Location</p>
                  <p>{client.accidentLocation}</p>
                </div>
              )}
              {client.injuryType && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Injury Type</p>
                  <p>{client.injuryType}</p>
                </div>
              )}
              {client.insuranceCompany && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Insurance Company</p>
                  <p>{client.insuranceCompany}</p>
                </div>
              )}
              {client.insurancePolicyNumber && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Policy Number</p>
                  <p>{client.insurancePolicyNumber}</p>
                </div>
              )}
            </div>
          </div>
          
          {client.caseDescription && (
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-medium mb-3">Case Description</h3>
              <p className="whitespace-pre-wrap">{client.caseDescription}</p>
            </div>
          )}
          
          {client.notes && (
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-medium mb-3">Notes</h3>
              <p className="whitespace-pre-wrap">{client.notes}</p>
            </div>
          )}
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-medium mb-3">Record Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Created On</p>
                <p>{new Date(client.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p>{new Date(client.updatedAt).toLocaleDateString()}</p>
              </div>
              {client.tags && client.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {client.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
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
