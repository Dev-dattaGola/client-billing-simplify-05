
import { useState, useEffect, useCallback } from "react";
import { CalendarEvent, calendarApi } from "@/lib/api/calendar-api";

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use useCallback to prevent this function from being recreated on every render
  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedEvents = await calendarApi.getEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies means this function is created once
  
  // Only run this effect once when the component mounts
  useEffect(() => {
    loadEvents();
  }, [loadEvents]); // loadEvents is memoized, so this won't cause infinite loops

  // Get dates with events for highlighting in the calendar - memoize this to prevent unnecessary calculations
  const getDatesWithEvents = useCallback(() => {
    return events.map(event => new Date(event.startDate));
  }, [events]); // Only recalculate when events change

  return {
    events,
    isLoading,
    getDatesWithEvents
  };
};
