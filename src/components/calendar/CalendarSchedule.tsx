
// Implementation for CalendarSchedule.tsx
// We're fixing the error with displayMonth, activeModifiers by ensuring correct typing

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarEvent, calendarApi } from "@/lib/api/calendar-api";
import { ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { DayPickerBase } from "react-day-picker";

interface CalendarScheduleProps {
  onAddEvent?: () => void;
  onSelectEvent?: (event: CalendarEvent) => void;
}

const CalendarSchedule: React.FC<CalendarScheduleProps> = ({
  onAddEvent,
  onSelectEvent
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showEventsDialog, setShowEventsDialog] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState<CalendarEvent[]>([]);
  const [viewingEvent, setViewingEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const fetchedEvents = await calendarApi.getEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEvents();
  }, []);

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

  // Get dates with events for highlighting in the calendar
  const getDatesWithEvents = () => {
    return events.map(event => new Date(event.startDate));
  };

  // Calculate event dots for the calendar
  const eventDates = getDatesWithEvents();
  
  // Handle opening the event details
  const handleEventClick = (event: CalendarEvent) => {
    setViewingEvent(event);
    if (onSelectEvent) {
      onSelectEvent(event);
    }
  };

  // Format the time from an ISO string
  const formatEventTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch {
      return '';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Prepare the modifiers in the format expected by react-day-picker
  const modifiers = {
    eventDay: eventDates
  };

  // Prepare the modifiers styles
  const modifiersStyles = {
    eventDay: {
      fontWeight: 'bold',
      textDecoration: 'underline',
      color: 'var(--primary)'
    }
  };

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
                onClick={() => {
                  const prevMonth = new Date(selectedDate);
                  prevMonth.setMonth(prevMonth.getMonth() - 1);
                  setSelectedDate(prevMonth);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-medium">
                {format(selectedDate, 'MMMM yyyy')}
              </h2>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const nextMonth = new Date(selectedDate);
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  setSelectedDate(nextMonth);
                }}
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
      <Dialog open={showEventsDialog} onOpenChange={setShowEventsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Events for {selectedDate.toLocaleDateString()}
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 space-y-3">
            {selectedDateEvents.map(event => (
              <div 
                key={event.id} 
                className="border p-3 rounded-md hover:bg-muted/50 cursor-pointer"
                onClick={() => handleEventClick(event)}
              >
                <h3 className="font-medium">{event.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <span>{formatEventTime(event.startDate)} - {formatEventTime(event.endDate)}</span>
                  {event.location && (
                    <span className="ml-2">• {event.location}</span>
                  )}
                </div>
                {event.description && (
                  <p className="text-sm mt-2">{event.description}</p>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalendarSchedule;
