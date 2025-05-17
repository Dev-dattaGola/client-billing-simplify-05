
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarEvent } from "@/lib/api/calendar-api";
import { Plus } from "lucide-react";
import CalendarHeader from "./schedule/CalendarHeader";
import CalendarView from "./schedule/CalendarView";
import EventList from "./schedule/EventList";
import LoadingState from "./schedule/LoadingState";
import { useCalendarEvents } from "./hooks/useCalendarEvents";

interface CalendarScheduleProps {
  onAddEvent?: () => void;
  onSelectEvent?: (event: CalendarEvent) => void;
}

const CalendarSchedule: React.FC<CalendarScheduleProps> = ({
  onAddEvent,
  onSelectEvent
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showEventsDialog, setShowEventsDialog] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState<CalendarEvent[]>([]);

  // Use our custom hook to fetch and manage events
  const { events, isLoading, getDatesWithEvents } = useCalendarEvents();

  // Handler for date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    
    // Find events for the selected date
    const dateEvents = events.filter(event => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
    
    if (dateEvents.length > 0) {
      setSelectedDateEvents(dateEvents);
      setShowEventsDialog(true);
    }
  };

  // Handle opening the event details
  const handleEventClick = (event: CalendarEvent) => {
    if (onSelectEvent) {
      onSelectEvent(event);
    }
  };

  // Navigate to previous month
  const handlePreviousMonth = () => {
    const prevMonth = new Date(selectedDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setSelectedDate(prevMonth);
  };

  // Navigate to next month
  const handleNextMonth = () => {
    const nextMonth = new Date(selectedDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setSelectedDate(nextMonth);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  // Prepare the modifiers in the format expected by react-day-picker
  const eventDates = getDatesWithEvents();
  const modifiers = {
    eventDay: eventDates
  };

  // Prepare the modifiers styles
  const modifiersStyles = {
    eventDay: {
      fontWeight: 'bold',
      textDecoration: 'underline',
      color: 'var(--white)'
    }
  };

  return (
    <>
      <Card className="glass-effect border-white/20 shadow-lg bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between border-b border-white/10">
          <CardTitle className="text-white">Calendar</CardTitle>
          {onAddEvent && (
            <Button onClick={onAddEvent} className="button-glass">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <CalendarHeader 
              selectedDate={selectedDate}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
            />
            
            <CalendarView 
              selectedDate={selectedDate}
              onSelect={handleDateSelect}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Dialog for showing events on a selected date */}
      <EventList 
        isOpen={showEventsDialog}
        onOpenChange={setShowEventsDialog}
        events={selectedDateEvents}
        onEventClick={handleEventClick}
        selectedDate={selectedDate}
      />
    </>
  );
};

export default CalendarSchedule;
