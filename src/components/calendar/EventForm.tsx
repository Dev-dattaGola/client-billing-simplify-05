
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
    <form onSubmit={handleSubmit} className="space-y-4 glass-effect border-white/20 bg-transparent text-white p-6 rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-white">Title *</Label>
        <Input 
          id="title" 
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="event-type" className="text-white">Event Type *</Label>
        <Select value={eventType} onValueChange={setEventType}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-white/20">
            {EVENT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value} className="text-white hover:bg-white/10">
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label className="text-white">Date *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white",
                !date && "text-white/50"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "MMMM d, yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-gray-800 text-white border-white/20 p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              classNames={{
                day_selected: "bg-amber-500 text-white hover:bg-amber-600",
                day_today: "bg-white/10 text-white",
                day: "text-white hover:bg-white/10"
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-time" className="text-white">Start Time *</Label>
          <Input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-time" className="text-white">End Time *</Label>
          <Input
            id="end-time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location" className="text-white">Location</Label>
        <Input 
          id="location" 
          placeholder="Event location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">Description</Label>
        <Textarea 
          id="description" 
          placeholder="Event description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="attendees" className="text-white">Attendees</Label>
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
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
          <Button 
            type="button" 
            onClick={addAttendee}
            className="bg-amber-600/70 hover:bg-amber-700/70 text-white"
          >
            Add
          </Button>
        </div>
        
        {attendees.length > 0 && (
          <div className="mt-3 space-y-2">
            {attendees.map((attendee, index) => (
              <div 
                key={index}
                className="flex items-center justify-between bg-white/10 p-2 rounded border border-white/20"
              >
                <span className="text-white">{attendee}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttendee(index)}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose} 
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="bg-amber-600/70 hover:bg-amber-700/70 text-white"
        >
          {isLoading ? "Saving..." : initialEvent ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
