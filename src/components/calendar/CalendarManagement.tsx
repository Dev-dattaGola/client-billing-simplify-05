
// Implementation for CalendarManagement.tsx
// We're fixing type compatibility issues with CalendarEvent and Task

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarEvent, calendarApi, Task, tasksApi } from "@/lib/api/calendar-api";
import CalendarSchedule from "./CalendarSchedule";
import TaskManagement from "./TaskManagement";
import EventForm from "./EventForm";
import EventDetails from "./EventDetails";
import { useToast } from "@/components/ui/use-toast";

const CalendarManagement: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const { toast } = useToast();

  // Handle adding a new event
  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsAddingEvent(true);
  };

  // Handle saving a new event
  const handleEventSave = async (eventData: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">) => {
    try {
      await calendarApi.createEvent(eventData);
      
      toast({
        title: "Event Created",
        description: "Your event has been successfully created."
      });
      
      setIsAddingEvent(false);
    } catch (error) {
      console.error("Error saving event:", error);
      
      toast({
        title: "Error",
        description: "There was a problem creating your event.",
        variant: "destructive"
      });
    }
  };

  // Handle updating an existing event
  const handleEventUpdate = async (eventId: string, updates: Partial<CalendarEvent>) => {
    try {
      await calendarApi.updateEvent(eventId, updates);
      
      toast({
        title: "Event Updated",
        description: "Your event has been successfully updated."
      });
      
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error updating event:", error);
      
      toast({
        title: "Error",
        description: "There was a problem updating your event.",
        variant: "destructive"
      });
    }
  };

  // Handle deleting an event
  const handleEventDelete = async (eventId: string) => {
    try {
      await calendarApi.deleteEvent(eventId);
      
      toast({
        title: "Event Deleted",
        description: "Your event has been successfully deleted."
      });
      
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error deleting event:", error);
      
      toast({
        title: "Error",
        description: "There was a problem deleting your event.",
        variant: "destructive"
      });
    }
  };

  // Handle event selection
  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsAddingEvent(false);
  };

  return (
    <Tabs defaultValue="calendar" className="w-full">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
      </TabsList>
      
      <TabsContent value="calendar" className="space-y-4 pt-4">
        {isAddingEvent ? (
          <EventForm 
            onSave={handleEventSave} 
            onCancel={() => setIsAddingEvent(false)}
          />
        ) : selectedEvent ? (
          <EventDetails 
            event={selectedEvent} 
            onUpdate={handleEventUpdate} 
            onDelete={handleEventDelete}
            onBack={() => setSelectedEvent(null)}
          />
        ) : (
          <CalendarSchedule 
            onAddEvent={handleAddEvent} 
            onSelectEvent={handleEventSelect} 
          />
        )}
      </TabsContent>
      
      <TabsContent value="tasks" className="pt-4">
        <TaskManagement />
      </TabsContent>
    </Tabs>
  );
};

export default CalendarManagement;
