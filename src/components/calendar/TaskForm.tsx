
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Task, TaskPriority, TaskStatus } from "@/types/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TaskFormProps {
  onSave: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const TaskForm = ({ onSave, onCancel, isLoading = false }: TaskFormProps) => {
  const today = new Date();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date>(today);
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("pending");
  const [assignedTo, setAssignedTo] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderDate, setReminderDate] = useState<Date>(today);
  const [reminderTime, setReminderTime] = useState("09:00");

  const handleSubmit = () => {
    // Prepare dates with combined date and time
    const getDateWithTime = (date: Date, time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes, 0, 0);
      return newDate;
    };

    // Create the task object
    const task: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo,
      reminder: reminderEnabled 
        ? getDateWithTime(reminderDate, reminderTime) 
        : undefined,
    };

    onSave(task);
  };

  const timeOptions = [
    "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30",
    "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30",
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30",
  ];

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className="resize-none min-h-24"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="assignedTo">Assigned To</Label>
        <Input 
          id="assignedTo" 
          value={assignedTo} 
          onChange={(e) => setAssignedTo(e.target.value)} 
          placeholder="Enter name"
        />
      </div>
      
      <div className="grid gap-2">
        <Label>Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={(date) => date && setDueDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="grid gap-2">
        <Label>Priority</Label>
        <RadioGroup value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="priority-low" />
              <Label htmlFor="priority-low">Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="priority-medium" />
              <Label htmlFor="priority-medium">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="priority-high" />
              <Label htmlFor="priority-high">High</Label>
            </div>
          </div>
        </RadioGroup>
      </div>
      
      <div className="grid gap-2">
        <Label>Status</Label>
        <RadioGroup value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pending" id="status-pending" />
              <Label htmlFor="status-pending">Pending</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="in-progress" id="status-in-progress" />
              <Label htmlFor="status-in-progress">In Progress</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completed" id="status-completed" />
              <Label htmlFor="status-completed">Completed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cancelled" id="status-cancelled" />
              <Label htmlFor="status-cancelled">Cancelled</Label>
            </div>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="reminder"
            checked={reminderEnabled}
            onCheckedChange={setReminderEnabled}
          />
          <Label htmlFor="reminder">Set Reminder</Label>
        </div>
        
        {reminderEnabled && (
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Reminder Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !reminderDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {reminderDate ? format(reminderDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={reminderDate}
                    onSelect={(date) => date && setReminderDate(date)}
                    disabled={(date) => date > dueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label>Reminder Time</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          onClick={handleSubmit} 
          disabled={isLoading || !title || !assignedTo}
        >
          {isLoading ? "Creating..." : "Create Task"}
        </Button>
      </div>
    </div>
  );
};

export default TaskForm;
