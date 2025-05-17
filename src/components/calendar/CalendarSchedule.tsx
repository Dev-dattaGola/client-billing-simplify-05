
import React, { useState, useCallback, useMemo } from "react";
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

  // Handler for date selection - memoize to prevent recreation on render
  const handleDateSelect = useCallback((date: Date | undefined) => {
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
    
    setSelectedDateEvents(dateEvents);
    if (dateEvents.length > 0) {
      setShowEventsDialog(true);
    }
  }, [events]);

  // Handle opening the event details - memoize to prevent recreation on render
  const handleEventClick = useCallback((event: CalendarEvent) => {
    if (onSelectEvent) {
      onSelectEvent(event);
    }
  }, [onSelectEvent]);

  // Navigate to previous month - memoize to prevent recreation on render
  const handlePreviousMonth = useCallback(() => {
    setSelectedDate(prevDate => {
      const prevMonth = new Date(prevDate);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      return prevMonth;
    });
  }, []);

  // Navigate to next month - memoize to prevent recreation on render
  const handleNextMonth = useCallback(() => {
    setSelectedDate(prevDate => {
      const nextMonth = new Date(prevDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth;
    });
  }, []);

  // Memoize these values to prevent unnecessary recalculations
  const eventDates = useMemo(() => getDatesWithEvents(), [getDatesWithEvents]);
  
  const modifiers = useMemo(() => ({
    eventDay: eventDates
  }), [eventDates]);

  const modifiersStyles = useMemo(() => ({
    eventDay: {
      fontWeight: 'bold',
      textDecoration: 'underline',
      color: 'var(--white)'
    }
  }), []);

  if (isLoading) {
    return <LoadingState />;
  }

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
