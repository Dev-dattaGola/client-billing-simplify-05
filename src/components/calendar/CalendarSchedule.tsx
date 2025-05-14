
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarEvent, calendarApi } from "@/lib/api/calendar-api";
import { ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

interface CalendarScheduleProps {
  onAddEvent?: () => void;
  onSelectEvent?: (event: CalendarEvent) => void;
}

// Event item component
const EventItem = React.memo(({ 
  event, 
  onEventClick,
  formatTime 
}: { 
  event: CalendarEvent, 
  onEventClick: (event: CalendarEvent) => void,
  formatTime: (dateString: string) => string
}) => (
  <div 
    key={event.id} 
    className="border p-3 rounded-md hover:bg-muted/50 cursor-pointer"
    onClick={() => onEventClick(event)}
  >
    <h3 className="font-medium">{event.title}</h3>
    <div className="flex items-center text-sm text-muted-foreground mt-1">
      <span>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
      {event.location && (
        <span className="ml-2">• {event.location}</span>
      )}
    </div>
    {event.description && (
      <p className="text-sm mt-2">{event.description}</p>
    )}
  </div>
));
EventItem.displayName = "EventItem";

// Event list component
const EventsList = React.memo(({ 
  events, 
  onEventClick,
  formatTime
}: { 
  events: CalendarEvent[], 
  onEventClick: (event: CalendarEvent) => void,
  formatTime: (dateString: string) => string
}) => (
  <div className="mt-4 space-y-3">
    {events.map(event => (
      <EventItem 
        key={event.id}
        event={event} 
        onEventClick={onEventClick}
        formatTime={formatTime} 
      />
    ))}
  </div>
));
EventsList.displayName = "EventsList";

const CalendarSchedule = React.memo<CalendarScheduleProps>(({
  onAddEvent,
  onSelectEvent
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showEventsDialog, setShowEventsDialog] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState<CalendarEvent[]>([]);
  
  // Use ref to prevent multiple fetch calls
  const isMountedRef = useRef(true);

  // Fetch events once on mount with proper cleanup
  useEffect(() => {
    const loadEvents = async () => {
      if (!isMountedRef.current) return;
      
      try {
        setIsLoading(true);
        const fetchedEvents = await calendarApi.getEvents();
        
        if (isMountedRef.current) {
          setEvents(fetchedEvents);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading events:", error);
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };
    
    loadEvents();
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Format time from ISO string - memoized to prevent recreating on each render
  const formatEventTime = useCallback((dateString: string) => {
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch {
      return '';
    }
  }, []);

  // Memoized handler for date selection
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
    
    if (dateEvents.length > 0) {
      setSelectedDateEvents(dateEvents);
      setShowEventsDialog(true);
    }
  }, [events]);

  // Memoized event handler
  const handleEventClick = useCallback((event: CalendarEvent) => {
    if (onSelectEvent) {
      onSelectEvent(event);
    }
    setShowEventsDialog(false);
  }, [onSelectEvent]);

  // Memoized navigation handlers
  const handlePrevMonth = useCallback(() => {
    const prevMonth = new Date(selectedDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setSelectedDate(prevMonth);
  }, [selectedDate]);

  const handleNextMonth = useCallback(() => {
    const nextMonth = new Date(selectedDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setSelectedDate(nextMonth);
  }, [selectedDate]);

  // Memoized dialog close handler
  const handleDialogChange = useCallback((open: boolean) => {
    setShowEventsDialog(open);
  }, []);

  // Memoized values
  // Get dates with events for highlighting in the calendar
  const eventDates = useMemo(() => events.map(event => new Date(event.startDate)), [events]);
  
  // Prepare modifiers for the calendar
  const modifiers = useMemo(() => ({ eventDay: eventDates }), [eventDates]);

  // Prepare modifier styles
  const modifiersStyles = useMemo(() => ({
    eventDay: {
      fontWeight: 'bold',
      textDecoration: 'underline',
      color: 'var(--primary)'
    }
  }), []);

  // Memoize formatted month title
  const monthTitle = useMemo(() => format(selectedDate, 'MMMM yyyy'), [selectedDate]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Calendar</CardTitle>
          {onAddEvent && (
            <Button onClick={onAddEvent}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-medium">
                {monthTitle}
              </h2>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border"
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Dialog for showing events on a selected date */}
      <Dialog open={showEventsDialog} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Events for {selectedDate.toLocaleDateString()}
            </DialogTitle>
          </DialogHeader>
          
          <EventsList 
            events={selectedDateEvents} 
            onEventClick={handleEventClick}
            formatTime={formatEventTime}
          />
        </DialogContent>
      </Dialog>
    </>
  );
});

// Add display name for debugging
CalendarSchedule.displayName = "CalendarSchedule";

export default CalendarSchedule;
