
import React from 'react';
import { Client } from '@/types/client';

interface PatientAttorneyChatProps {
  client: Client;
  isVisible?: boolean;  // Making isVisible optional
}

const PatientAttorneyChat: React.FC<PatientAttorneyChatProps> = ({ 
  client, 
  isVisible = false 
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div id="patient-attorney-chat" className="border rounded-lg p-4 bg-white shadow-sm">
      <h2 className="text-lg font-medium mb-4">Attorney Chat</h2>
      <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
        <p className="text-gray-500">Chat functionality would be implemented here for client {client.fullName}</p>
      </div>
    </div>
  );
};

// Apply memo to prevent unnecessary re-renders
export default React.memo(PatientAttorneyChat);
