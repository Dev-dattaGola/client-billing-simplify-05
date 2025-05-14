
// Implementation for TaskManagement.tsx
// We're fixing the type issues with Task[] and ensuring status values match expected values

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { tasksApi, Task as ApiTask } from "@/lib/api/calendar-api"; 
import { Task as AppTask } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskForm from "./TaskForm";
import TaskDetails from "./TaskDetails";
import { Loader2, Plus } from "lucide-react";

interface TaskManagementProps {
  // Props as needed
}

// Create a type mapper function to convert between API Task and App Task types
const mapApiTaskToAppTask = (apiTask: ApiTask): AppTask => {
  return {
    id: apiTask.id,
    title: apiTask.title,
    description: apiTask.description || "",  // Handle optional field
    dueDate: apiTask.dueDate ? new Date(apiTask.dueDate) : new Date(),
    priority: apiTask.priority as AppTask['priority'],
    status: apiTask.status === 'todo' ? 'pending' : apiTask.status as AppTask['status'],
    assignedTo: apiTask.assignedTo || "",
    reminder: apiTask.dueDate ? new Date(apiTask.dueDate) : undefined,
    caseId: apiTask.associatedCaseId,
    clientId: undefined,
    createdAt: new Date(apiTask.createdAt),
    updatedAt: new Date(apiTask.updatedAt)
  };
};

// Convert App Task to API Task
const mapAppTaskToApiTask = (appTask: Partial<AppTask>): Partial<ApiTask> => {
  // Create a new object to hold API task properties
  const apiTask: Partial<ApiTask> = {};
  
  // Copy primitive properties that have the same name and compatible types
  if (appTask.id) apiTask.id = appTask.id;
  if (appTask.title) apiTask.title = appTask.title;
  if (appTask.description) apiTask.description = appTask.description;
  if (appTask.assignedTo) apiTask.assignedTo = appTask.assignedTo;
  if (appTask.priority) apiTask.priority = appTask.priority;
  
  // Convert status
  if (appTask.status) {
    apiTask.status = appTask.status === 'pending' ? 'todo' : 
                    (appTask.status === 'cancelled' ? 'todo' : 
                    appTask.status as 'in-progress' | 'completed');
  }
  
  // Convert Date to string for dueDate if it exists
  if (appTask.dueDate) {
    apiTask.dueDate = appTask.dueDate.toISOString();
  }
  
  // Map caseId to associatedCaseId if it exists
  if (appTask.caseId) {
    apiTask.associatedCaseId = appTask.caseId;
  }

  return apiTask;
};

// Render task list component extracted to avoid re-renders
const TaskList = React.memo(({ 
  tasks, 
  onTaskClick 
}: { 
  tasks: AppTask[], 
  onTaskClick: (task: AppTask) => void 
}) => {
  if (tasks.length === 0) {
    return <p className="text-center py-8 text-muted-foreground">No tasks found.</p>;
  }
  
  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <div 
          key={task.id} 
          onClick={() => onTaskClick(task)}
          className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{task.title}</h3>
              {task.dueDate && (
                <p className="text-sm text-muted-foreground">
                  Due: {task.dueDate.toLocaleDateString()}
                </p>
              )}
            </div>
            <div className={`px-2 py-1 rounded-md text-xs ${
              task.status === 'completed' ? 'bg-green-100 text-green-800' :
              task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
              task.status === 'pending' ? 'bg-amber-100 text-amber-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {task.status === 'pending' ? 'To Do' : 
              task.status === 'in-progress' ? 'In Progress' : 
              task.status === 'cancelled' ? 'Cancelled' :
              'Completed'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
TaskList.displayName = "TaskList";

const TaskManagement: React.FC<TaskManagementProps> = () => {
  // Use the App Task type for state
  const [tasks, setTasks] = useState<AppTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<AppTask | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use useEffect with proper cleanup
  useEffect(() => {
    let isMounted = true;
    
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const fetchedTasks = await tasksApi.getTasks();
        
        // Only update state if component is still mounted
        if (isMounted) {
          // Convert the API tasks to our App tasks
          const mappedTasks = fetchedTasks.map(mapApiTaskToAppTask);
          setTasks(mappedTasks);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadTasks();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Memoize event handlers
  const handleAddTask = useCallback(() => {
    setSelectedTask(null);
    setIsAddingTask(true);
  }, []);
  
  const handleTaskClick = useCallback((task: AppTask) => {
    setSelectedTask(task);
    setIsAddingTask(false);
  }, []);
  
  const handleTaskSave = useCallback(async (taskData: Omit<AppTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Convert App Task to API Task
      const apiTaskData = mapAppTaskToApiTask(taskData);
      
      // Create the task via API
      const newApiTask = await tasksApi.createTask(apiTaskData as Omit<ApiTask, 'id' | 'createdAt' | 'updatedAt'>);
      
      // Convert back to App Task and add to state
      const newAppTask = mapApiTaskToAppTask(newApiTask);
      setTasks(prevTasks => [...prevTasks, newAppTask]);
      setIsAddingTask(false);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  }, []);
  
  const handleTaskUpdate = useCallback(async (taskId: string, updates: Partial<AppTask>) => {
    try {
      // Convert updates to API format
      const apiUpdates = mapAppTaskToApiTask(updates);
      
      // Update through API
      const updatedApiTask = await tasksApi.updateTask(taskId, apiUpdates);
      
      // Update local state with converted App Task
      const updatedAppTask = mapApiTaskToAppTask(updatedApiTask);
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === taskId ? updatedAppTask : task
      ));
      setSelectedTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }, []);
  
  const handleTaskDelete = useCallback(async (taskId: string) => {
    try {
      await tasksApi.deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      setSelectedTask(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }, []);
  
  // Compute filtered tasks for each tab to avoid recalculation
  const allTasks = useMemo(() => tasks, [tasks]);
  const pendingTasks = useMemo(() => tasks.filter(task => task.status === 'pending'), [tasks]);
  const inProgressTasks = useMemo(() => tasks.filter(task => task.status === 'in-progress'), [tasks]);
  const completedTasks = useMemo(() => tasks.filter(task => task.status === 'completed'), [tasks]);
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Conditionally render form, details, or task list
  if (isAddingTask) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm onSave={handleTaskSave} onCancel={() => setIsAddingTask(false)} />
        </CardContent>
      </Card>
    );
  }
  
  if (selectedTask) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskDetails 
            task={selectedTask} 
            onUpdate={handleTaskUpdate} 
            onDelete={handleTaskDelete} 
            onBack={() => setSelectedTask(null)} 
          />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tasks</CardTitle>
        <Button onClick={handleAddTask}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">To Do</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <TaskList tasks={allTasks} onTaskClick={handleTaskClick} />
          </TabsContent>
          
          <TabsContent value="pending">
            <TaskList tasks={pendingTasks} onTaskClick={handleTaskClick} />
          </TabsContent>
          
          <TabsContent value="in-progress">
            <TaskList tasks={inProgressTasks} onTaskClick={handleTaskClick} />
          </TabsContent>
          
          <TabsContent value="completed">
            <TaskList tasks={completedTasks} onTaskClick={handleTaskClick} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default React.memo(TaskManagement);
