
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, set, addHours } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarEvent } from '@/types/calendar';
import { User } from '@/types/user';

// Mock user API
const fetchClients = async (attorneyId: string): Promise<User[]> => {
  // In a real app, this would fetch from the database
  return [
    {
      id: 'client1',
      name: 'Client User',
      email: 'client@lawerp.com',
      role: 'client',
      firmId: 'firm1',
      assignedAttorneyId: attorneyId,
      permissions: []
    }
  ];
};

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading: boolean;
  initialDate?: Date | null;
  editingEvent?: CalendarEvent | null;
}

interface TimeOption {
  label: string;
  value: string;
}

const generateTimeOptions = (): TimeOption[] => {
  const options: TimeOption[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const h = hour % 12 || 12;
      const m = minute.toString().padStart(2, '0');
      const ampm = hour < 12 ? 'AM' : 'PM';
      const label = `${h}:${m} ${ampm}`;
      options.push({
        label,
        value: `${hour.toString().padStart(2, '0')}:${m}`
      });
    }
  }
  return options;
};

const EventForm: React.FC<EventFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialDate,
  editingEvent
}) => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | undefined>(initialDate || new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState('');
  const [color, setColor] = useState('#4f46e5'); // Default: indigo
  const [reminderTime, setReminderTime] = useState<Date | undefined>(undefined);
  const [clients, setClients] = useState<User[]>([]);
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  
  const timeOptions = generateTimeOptions();

  useEffect(() => {
    // If editing an existing event
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description || '');
      setDate(new Date(editingEvent.start));
      
      if (!editingEvent.allDay) {
        const startDate = new Date(editingEvent.start);
        const endDate = new Date(editingEvent.end);
        setStartTime(format(startDate, 'HH:mm'));
        setEndTime(format(endDate, 'HH:mm'));
      }
      
      setAllDay(editingEvent.allDay);
      setLocation(editingEvent.location || '');
      setColor(editingEvent.color || '#4f46e5');
      
      if (editingEvent.reminderTime) {
        setReminderTime(new Date(editingEvent.reminderTime));
      }
      
      // Set participants if they exist
      if (editingEvent.participants && editingEvent.participants.length > 0) {
        setSelectedClientIds(editingEvent.participants);
      }
    }
  }, [editingEvent]);

  useEffect(() => {
    // Load assigned clients if user is an attorney
    const loadClients = async () => {
      if (currentUser?.role === 'attorney' && currentUser?.id) {
        try {
          const clientList = await fetchClients(currentUser.id);
          setClients(clientList);
        } catch (err) {
          console.error("Error loading clients:", err);
        }
      }
    };
    
    loadClients();
  }, [currentUser]);

  const handleSubmit = () => {
    if (!date) return;
    
    let startDate: Date;
    let endDate: Date;
    
    if (allDay) {
      // Set start and end to the selected date (ignoring time)
      startDate = new Date(date);
      endDate = new Date(date);
    } else {
      // Combine date with time
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      startDate = set(new Date(date), {
        hours: startHour,
        minutes: startMinute,
        seconds: 0,
        milliseconds: 0
      });
      
      endDate = set(new Date(date), {
        hours: endHour,
        minutes: endMinute,
        seconds: 0,
        milliseconds: 0
      });
      
      // If end time is before start time, assume it's the next day
      if (endDate < startDate) {
        endDate = addHours(endDate, 24);
      }
    }

    // Create the event object
    const eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'> = {
      title,
      description,
      start: startDate,
      end: endDate,
      allDay,
      color,
      location: location || undefined,
      reminderTime: reminderTime,
      participants: selectedClientIds.length > 0 ? selectedClientIds : undefined
    };
    
    onSubmit(eventData);
  };

  const toggleClientSelection = (clientId: string) => {
    setSelectedClientIds(prev => {
      if (prev.includes(clientId)) {
        return prev.filter(id => id !== clientId);
      } else {
        return [...prev, clientId];
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              placeholder="Enter event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter event description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select date</span>}
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
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="allDay" className="flex-grow">All Day Event</Label>
            <Switch 
              id="allDay" 
              checked={allDay} 
              onCheckedChange={setAllDay} 
            />
          </div>
          
          {!allDay && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger id="startTime">
                    <SelectValue placeholder="Select start time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {timeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger id="endTime">
                    <SelectValue placeholder="Select end time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {timeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          {currentUser?.role === 'attorney' && clients.length > 0 && (
            <div className="space-y-2">
              <Label>Select Clients</Label>
              <div className="border rounded-md p-3 space-y-2">
                {clients.map((client) => (
                  <div key={client.id} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id={`client-${client.id}`} 
                      checked={selectedClientIds.includes(client.id)}
                      onChange={() => toggleClientSelection(client.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor={`client-${client.id}`} className="text-sm">
                      {client.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Event Color</Label>
            <RadioGroup 
              value={color} 
              onValueChange={setColor}
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="#ef4444" id="color-red" className="bg-red-500 border-red-500" />
                <Label htmlFor="color-red" className="sr-only">Red</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="#f97316" id="color-orange" className="bg-orange-500 border-orange-500" />
                <Label htmlFor="color-orange" className="sr-only">Orange</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="#4f46e5" id="color-indigo" className="bg-indigo-500 border-indigo-500" />
                <Label htmlFor="color-indigo" className="sr-only">Indigo</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="#10b981" id="color-emerald" className="bg-emerald-500 border-emerald-500" />
                <Label htmlFor="color-emerald" className="sr-only">Emerald</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading || !title || !date}>
            {isLoading ? "Saving..." : editingEvent ? "Update Event" : "Create Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
