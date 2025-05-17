
import { User } from "lucide-react";

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-white/70">
      <User className="h-16 w-16 mb-4 text-white/50" />
      <h3 className="text-xl font-medium text-white">No conversation selected</h3>
      <p className="mt-2 text-white/70">Select a contact to start messaging</p>
    </div>
  );
};

export default EmptyState;
