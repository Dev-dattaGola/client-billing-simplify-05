
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarEvent } from "@/lib/api/calendar-api";
import { format } from "date-fns";

interface EventListProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  selectedDate: Date;
}

const EventList: React.FC<EventListProps> = ({
  isOpen,
  onOpenChange,
  events,
  onEventClick,
  selectedDate,
}) => {
  // Format the time from an ISO string
  const formatEventTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch {
      return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect border-white/20 bg-transparent text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            Events for {selectedDate.toLocaleDateString()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-3">
          {events.map(event => (
            <div 
              key={event.id} 
              className="border border-white/20 p-3 rounded-md hover:bg-white/10 cursor-pointer"
              onClick={() => onEventClick(event)}
            >
              <h3 className="font-medium text-white">{event.title}</h3>
              <div className="flex items-center text-sm text-white/80 mt-1">
                <span>{formatEventTime(event.startDate)} - {formatEventTime(event.endDate)}</span>
                {event.location && (
                  <span className="ml-2">• {event.location}</span>
                )}
              </div>
              {event.description && (
                <p className="text-sm mt-2 text-white/70">{event.description}</p>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventList;
