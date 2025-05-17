
import React from "react";
import { Calendar } from "@/components/ui/calendar";

interface CalendarViewProps {
  selectedDate: Date;
  onSelect: (date: Date | undefined) => void;
  modifiers: any;
  modifiersStyles: any;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  onSelect,
  modifiers,
  modifiersStyles
}) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-md p-4 w-full">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        className="text-white"
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        classNames={{
          day_selected: "bg-amber-500 text-white hover:bg-amber-600",
          day_today: "bg-white/10 text-white",
          day: "text-white hover:bg-white/10"
        }}
      />
    </div>
  );
};

export default React.memo(CalendarView); // Memoize the component
