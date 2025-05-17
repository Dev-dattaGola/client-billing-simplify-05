
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const LoadingState: React.FC = () => {
  return (
    <Card className="glass-effect border-white/20 shadow-lg bg-transparent text-white">
      <CardContent className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </CardContent>
    </Card>
  );
};

export default LoadingState;
