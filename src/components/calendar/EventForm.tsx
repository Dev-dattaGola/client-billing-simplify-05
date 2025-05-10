
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, X } from "lucide-react";
import { CalendarEvent } from "@/lib/api/calendar-api";

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">) => void;
  isLoading: boolean;
  initialDate?: Date | null;
  initialEvent?: CalendarEvent;
}

const EVENT_TYPES = [
  { value: "meeting", label: "Meeting" },
  { value: "appointment", label: "Appointment" },
  { value: "deposition", label: "Deposition" },
  { value: "deadline", label: "Deadline" },
  { value: "reminder", label: "Reminder" },
];

const EventForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading,
  initialDate,
  initialEvent
}: EventFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("meeting");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [location, setLocation] = useState("");
  const [attendees, setAttendees] = useState<string[]>([]);
  const [newAttendee, setNewAttendee] = useState("");

  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
    
    if (initialEvent) {
      setTitle(initialEvent.title);
      setDescription(initialEvent.description || "");
      setEventType(initialEvent.type);
      setLocation(initialEvent.location || "");
      
      // Set date
      const startDate = new Date(initialEvent.startDate);
      setDate(startDate);
      
      // Set times
      setStartTime(format(startDate, "HH:mm"));
      setEndTime(format(new Date(initialEvent.endDate), "HH:mm"));
      
      // Set attendees
      setAttendees(initialEvent.attendees || []);
    }
  }, [initialDate, initialEvent, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date) {
      return;
    }
    
    // Create start and end date objects
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    
    const startDate = new Date(date);
    startDate.setHours(startHour, startMinute, 0);
    
    const endDate = new Date(date);
    endDate.setHours(endHour, endMinute, 0);
    
    const eventData: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt"> = {
      title,
      description: description || undefined,
      type: eventType as CalendarEvent["type"],
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      location: location || undefined,
      attendees: attendees.length > 0 ? attendees : undefined,
    };
    
    onSubmit(eventData);
  };

  const addAttendee = () => {
    if (newAttendee.trim()) {
      setAttendees([...attendees, newAttendee.trim()]);
      setNewAttendee("");
    }
  };

  const removeAttendee = (index: number) => {
    setAttendees(attendees.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input 
          id="title" 
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="event-type">Event Type *</Label>
        <Select value={eventType} onValueChange={setEventType}>
          <SelectTrigger>
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            {EVENT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Date *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "MMMM d, yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-time">Start Time *</Label>
          <Input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-time">End Time *</Label>
          <Input
            id="end-time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input 
          id="location" 
          placeholder="Event location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          placeholder="Event description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="attendees">Attendees</Label>
        <div className="flex space-x-2">
          <Input 
            id="attendees" 
            placeholder="Add attendee"
            value={newAttendee}
            onChange={(e) => setNewAttendee(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addAttendee();
              }
            }}
          />
          <Button type="button" onClick={addAttendee}>
            Add
          </Button>
        </div>
        
        {attendees.length > 0 && (
          <div className="mt-3 space-y-2">
            {attendees.map((attendee, index) => (
              <div 
                key={index}
                className="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <span>{attendee}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttendee(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialEvent ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
