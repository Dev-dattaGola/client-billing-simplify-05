
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format } from "date-fns";

interface CalendarHeaderProps {
  selectedDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onAddEvent?: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  selectedDate,
  onPreviousMonth,
  onNextMonth,
  onAddEvent
}) => {
  // Format the date once instead of on every render
  const formattedDate = format(selectedDate, 'MMMM yyyy');

  return (
    <div className="flex items-center justify-between w-full mb-4">
      <Button
        variant="outline"
        size="icon"
        className="border-white/20 bg-white/5 text-white hover:bg-white/10"
        onClick={onPreviousMonth}
        type="button" // Explicitly set button type
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h2 className="text-lg font-medium text-white">
        {formattedDate}
      </h2>
      <Button
        variant="outline"
        size="icon"
        className="border-white/20 bg-white/5 text-white hover:bg-white/10"
        onClick={onNextMonth}
        type="button" // Explicitly set button type
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default React.memo(CalendarHeader); // Memoize the component to prevent unnecessary re-renders
