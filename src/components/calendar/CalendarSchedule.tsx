
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, CalendarIcon, Clock, MapPin, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { calendarApi, CalendarEvent } from "@/lib/api/calendar-api";
import EventForm from "./EventForm";

interface CalendarScheduleProps {
  onDateSelect?: (date: Date) => void;
}

const CalendarSchedule = ({ onDateSelect }: CalendarScheduleProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewingEvents, setIsViewingEvents] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dateEvents, setDateEvents] = useState<CalendarEvent[]>([]);
  
  const { toast } = useToast();

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadDateEvents(selectedDate);
    }
  }, [selectedDate, events]);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const allEvents = await calendarApi.getEvents();
      setEvents(allEvents);
    } catch (error) {
      console.error("Error loading events:", error);
      toast({
        title: "Error",
        description: "Failed to load calendar events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadDateEvents = (date: Date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    
    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate >= start && eventDate <= end;
    });
    
    setDateEvents(filteredEvents);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    setIsViewingEvents(true);
    
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEditMode(true);
  };

  const handleDeleteEvent = async (event: CalendarEvent) => {
    if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
      try {
        await calendarApi.deleteEvent(event.id);
        
        toast({
          title: "Event Deleted",
          description: `"${event.title}" has been deleted`,
        });
        
        // Refresh events
        loadEvents();
        
        // Close event detail dialog
        setSelectedEvent(null);
      } catch (error) {
        console.error("Error deleting event:", error);
        toast({
          title: "Error",
          description: "Failed to delete the event",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdateEvent = async (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedEvent) return;
    
    try {
      await calendarApi.updateEvent(selectedEvent.id, event);
      
      toast({
        title: "Event Updated",
        description: `"${event.title}" has been updated`,
      });
      
      // Refresh events
      loadEvents();
      
      // Close edit form
      setIsEditMode(false);
      
      // Update selected event view
      const updatedEvent = await calendarApi.getEvent(selectedEvent.id);
      setSelectedEvent(updatedEvent);
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error",
        description: "Failed to update the event",
        variant: "destructive",
      });
    }
  };

  // Function to check if a date has events
  const hasEvents = (date: Date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    
    return events.some(event => {
      const eventDate = new Date(event.startDate);
      return eventDate >= start && eventDate <= end;
    });
  };

  // Get event count for a date
  const getEventCount = (date: Date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate >= start && eventDate <= end;
    }).length;
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get color based on event type
  const getEventColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-500 hover:bg-blue-600";
      case "appointment":
        return "bg-green-500 hover:bg-green-600";
      case "deposition":
        return "bg-purple-500 hover:bg-purple-600";
      case "deadline":
        return "bg-red-500 hover:bg-red-600";
      case "reminder":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6">
          <Card className="overflow-hidden">
            <Calendar
              mode="single"
              selected={selectedDate || undefined}
              onSelect={handleDateSelect}
              className="p-0"
              modifiersStyles={{
                selected: {
                  backgroundColor: 'rgb(59 130 246)',
                  color: 'white',
                },
                today: {
                  fontWeight: 'bold',
                  border: '2px solid rgb(59 130 246)',
                }
              }}
              modifiers={{
                hasEvents: (date) => hasEvents(date),
              }}
              components={{
                DayContent: ({ date, ...props }) => {
                  const eventCount = getEventCount(date);
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div {...props} />
                      {eventCount > 0 && (
                        <div className="absolute -bottom-1">
                          <div className={`w-${Math.min(eventCount, 3) * 1.5} h-1 rounded-full bg-blue-500`} />
                        </div>
                      )}
                    </div>
                  );
                },
              }}
            />
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {selectedDate?.toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                <Badge variant="outline" className="ml-2">
                  {dateEvents.length} Event{dateEvents.length !== 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center text-gray-500">Loading events...</div>
              ) : dateEvents.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  No events scheduled for this day
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-24rem)]">
                  <div className="space-y-3">
                    {dateEvents.map((event) => (
                      <Button
                        key={event.id}
                        variant="default"
                        className={`w-full justify-start text-white text-left ${getEventColor(event.type)} hover:cursor-pointer p-3 h-auto`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex flex-col w-full">
                          <div className="flex justify-between items-start">
                            <span className="font-medium">{event.title}</span>
                            <Badge variant="outline" className="bg-white/20 border-white/40 text-white text-xs ml-2">
                              {event.type}
                            </Badge>
                          </div>
                          <div className="text-sm mt-1 flex items-center">
                            <Clock className="h-3 w-3 mr-1 inline" />
                            {formatTime(event.startDate)} - {formatTime(event.endDate)}
                          </div>
                          {event.location && (
                            <div className="text-xs mt-1">
                              <MapPin className="h-3 w-3 mr-1 inline" />
                              {event.location}
                            </div>
                          )}
                          {event.attendees && event.attendees.length > 0 && (
                            <div className="text-xs mt-1 flex items-center">
                              <User className="h-3 w-3 mr-1 inline" />
                              {event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Event Detail Dialog */}
      <Dialog open={!!selectedEvent && !isEditMode} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Start</h4>
                  <p>{new Date(selectedEvent.startDate).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">End</h4>
                  <p>{new Date(selectedEvent.endDate).toLocaleString()}</p>
                </div>
              </div>
              
              {selectedEvent.location && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Location</h4>
                  <p>{selectedEvent.location}</p>
                </div>
              )}
              
              {selectedEvent.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="whitespace-pre-line">{selectedEvent.description}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Type</h4>
                <Badge className={`mt-1 ${getEventColor(selectedEvent.type)} text-white`}>
                  {selectedEvent.type}
                </Badge>
              </div>
              
              {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Attendees</h4>
                  <div className="mt-1 space-y-1">
                    {selectedEvent.attendees.map((attendee, index) => (
                      <div key={index} className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <span>{attendee}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between pt-4 border-t">
                <Button 
                  variant="ghost" 
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => handleDeleteEvent(selectedEvent)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                
                <Button onClick={() => setIsEditMode(true)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Edit Event Dialog */}
      <Dialog open={isEditMode} onOpenChange={(open) => !open && setIsEditMode(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <EventForm
              isOpen={isEditMode}
              onClose={() => setIsEditMode(false)}
              onSubmit={handleUpdateEvent}
              isLoading={isLoading}
              initialDate={selectedDate}
              initialEvent={selectedEvent}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalendarSchedule;
