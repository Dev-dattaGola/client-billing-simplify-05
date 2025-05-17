
import { useState, useEffect } from "react";
import { CalendarEvent, calendarApi } from "@/lib/api/calendar-api";

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Get dates with events for highlighting in the calendar
  const getDatesWithEvents = () => {
    return events.map(event => new Date(event.startDate));
  };

  return {
    events,
    isLoading,
    getDatesWithEvents
  };
};
