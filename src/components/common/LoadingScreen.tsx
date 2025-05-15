
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="h-16 w-16 text-primary animate-spin" />
      <p className="mt-4 text-lg text-gray-600">Loading...</p>
    </div>
  );
};

export default LoadingScreen;
