
import React from "react";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/calendar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CalendarClock, Calendar as CalendarIcon, CheckCircle, Circle, Clock, User, XCircle, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface TaskDetailsProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const TaskDetails = ({ task, onUpdate, onDelete, onBack }: TaskDetailsProps) => {
  const formatDate = (date: Date | string) => {
    return format(new Date(date), "EEEE, MMMM d, yyyy");
  };
  
  const formatTime = (date: Date | string) => {
    return format(new Date(date), "h:mm a");
  };

  const getPriorityBadge = () => {
    switch (task.priority) {
      case "high":
        return <Badge variant="outline" className="bg-red-800/50 text-red-100 border-red-500/30">High Priority</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-amber-800/50 text-amber-100 border-amber-500/30">Medium Priority</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-green-800/50 text-green-100 border-green-500/30">Low Priority</Badge>;
    }
  };

  const getStatusBadge = () => {
    switch (task.status) {
      case "completed":
        return <Badge variant="outline" className="bg-green-800/50 text-green-100 border-green-500/30">Completed</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-800/50 text-blue-100 border-blue-500/30">In Progress</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-gray-800/50 text-gray-100 border-gray-500/30">Cancelled</Badge>;
      case "pending":
      default:
        return <Badge variant="outline" className="bg-amber-800/50 text-amber-100 border-amber-500/30">Pending</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-400" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-gray-400" />;
      case "pending":
      default:
        return <Circle className="h-5 w-5 text-amber-400" />;
    }
  };

  const handleStatusChange = (status: string) => {
    // Convert UI status to API status if needed
    let apiStatus: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    
    if (status === 'pending' || status === 'cancelled') {
      apiStatus = status as 'pending' | 'cancelled';
    } else if (status === 'in-progress') {
      apiStatus = 'in-progress';
    } else if (status === 'completed') {
      apiStatus = 'completed';
    } else {
      apiStatus = 'pending'; // Default fallback
    }
    
    onUpdate(task.id, { status: apiStatus });
  };

  return (
    <div className="space-y-6 glass-effect border-white/20 bg-transparent text-white p-6 rounded-lg">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          Back
        </Button>
      </div>
      
      <div>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <h2 className="text-xl font-semibold text-white">{task.title}</h2>
        </div>
        
        {task.description && (
          <p className="mt-2 text-white/80">
            {task.description}
          </p>
        )}
      </div>
      
      <div className="py-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {getPriorityBadge()}
          {getStatusBadge()}
        </div>
        
        <div className="flex items-start gap-3">
          <User className="h-5 w-5 text-white/70 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-white">Assigned To</p>
            <p className="text-sm text-white/70">{task.assignedTo}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <CalendarIcon className="h-5 w-5 text-white/70 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-white">Due Date</p>
            <p className="text-sm text-white/70">
              {formatDate(task.dueDate)}
            </p>
          </div>
        </div>
        
        {task.reminder && (
          <div className="flex items-start gap-3">
            <CalendarClock className="h-5 w-5 text-white/70 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-white">Reminder</p>
              <p className="text-sm text-white/70">
                {formatDate(task.reminder)}, {formatTime(task.reminder)}
              </p>
            </div>
          </div>
        )}
        
        {task.caseId && (
          <div className="flex items-start gap-3">
            <div>
              <p className="font-medium text-white">Related Case</p>
              <p className="text-sm text-white/70">
                Case ID: {task.caseId}
              </p>
            </div>
          </div>
        )}
        
        {task.clientId && (
          <div className="flex items-start gap-3">
            <div>
              <p className="font-medium text-white">Related Client</p>
              <p className="text-sm text-white/70">
                Client ID: {task.clientId}
              </p>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <p className="font-medium text-white">Change Status:</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {task.status}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-white/20">
              <DropdownMenuItem onClick={() => handleStatusChange("pending")} className="text-white hover:bg-white/10">
                <Circle className="h-4 w-4 mr-2 text-amber-400" />
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("in-progress")} className="text-white hover:bg-white/10">
                <Clock className="h-4 w-4 mr-2 text-blue-400" />
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("completed")} className="text-white hover:bg-white/10">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("cancelled")} className="text-white hover:bg-white/10">
                <XCircle className="h-4 w-4 mr-2 text-gray-400" />
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              className="gap-2 bg-red-600/70 hover:bg-red-700/70 text-white"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="glass-effect border-white/20 bg-transparent text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-white/80">
                This action cannot be undone. This will permanently delete the task.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white/10 text-white border-white/20 hover:bg-white/20">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onDelete(task.id)} 
                className="bg-red-600/70 hover:bg-red-700/70 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Button 
          onClick={onBack}
          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default TaskDetails;
