
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-background">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <h2 className="text-lg font-medium mt-4 text-slate-700">Loading...</h2>
        <p className="text-sm text-slate-500 mt-1">Please wait while we load your content.</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
