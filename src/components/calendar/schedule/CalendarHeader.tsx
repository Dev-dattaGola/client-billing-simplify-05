
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
  return (
    <div className="flex items-center justify-between w-full mb-4">
      <Button
        variant="outline"
        size="icon"
        className="border-white/20 bg-white/5 text-white hover:bg-white/10"
        onClick={onPreviousMonth}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h2 className="text-lg font-medium text-white">
        {format(selectedDate, 'MMMM yyyy')}
      </h2>
      <Button
        variant="outline"
        size="icon"
        className="border-white/20 bg-white/5 text-white hover:bg-white/10"
        onClick={onNextMonth}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CalendarHeader;
