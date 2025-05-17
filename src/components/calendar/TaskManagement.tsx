
// Implementation for TaskManagement.tsx
// We're fixing the type issues with Task[] and ensuring status values match expected values

import React, { useState, useEffect } from "react";
import { tasksApi, Task as ApiTask } from "@/lib/api/calendar-api"; 
import { Task as AppTask } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskForm from "./TaskForm";  // Default import
import TaskDetails from "./TaskDetails";  // Default import
import { Loader2, Plus } from "lucide-react";

interface TaskManagementProps {
  // Add props as needed
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
  
  // We don't need to explicitly remove properties not in ApiTask as they won't be included in apiTask

  return apiTask;
};

const TaskManagement: React.FC<TaskManagementProps> = () => {
  // Use the App Task type for state
  const [tasks, setTasks] = useState<AppTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<AppTask | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const fetchedTasks = await tasksApi.getTasks();
        // Convert the API tasks to our App tasks
        const mappedTasks = fetchedTasks.map(mapApiTaskToAppTask);
        setTasks(mappedTasks);
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTasks();
  }, []);
  
  const handleAddTask = () => {
    setSelectedTask(null);
    setIsAddingTask(true);
  };
  
  const handleTaskClick = (task: AppTask) => {
    setSelectedTask(task);
    setIsAddingTask(false);
  };
  
  const handleTaskSave = async (taskData: Omit<AppTask, 'id' | 'createdAt' | 'updatedAt'>) => {
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
  };
  
  const handleTaskUpdate = async (taskId: string, updates: Partial<AppTask>) => {
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
  };
  
  const handleTaskDelete = async (taskId: string) => {
    try {
      await tasksApi.deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      setSelectedTask(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }
  
  return (
    <Card className="glass-effect border-white/20 bg-transparent shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/10">
        <CardTitle className="text-white">Tasks</CardTitle>
        <Button onClick={handleAddTask} className="bg-amber-600/70 hover:bg-amber-700/70 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        {isAddingTask ? (
          <TaskForm onSave={handleTaskSave} onCancel={() => setIsAddingTask(false)} />
        ) : selectedTask ? (
          <TaskDetails 
            task={selectedTask} 
            onUpdate={handleTaskUpdate} 
            onDelete={handleTaskDelete} 
            onBack={() => setSelectedTask(null)} 
          />
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4 bg-white/5 border border-white/10">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
              >
                To Do
              </TabsTrigger>
              <TabsTrigger 
                value="in-progress" 
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
              >
                In Progress
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
              >
                Completed
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {renderTaskList(tasks, handleTaskClick)}
            </TabsContent>
            
            <TabsContent value="pending">
              {renderTaskList(tasks.filter(task => task.status === 'pending'), handleTaskClick)}
            </TabsContent>
            
            <TabsContent value="in-progress">
              {renderTaskList(tasks.filter(task => task.status === 'in-progress'), handleTaskClick)}
            </TabsContent>
            
            <TabsContent value="completed">
              {renderTaskList(tasks.filter(task => task.status === 'completed'), handleTaskClick)}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

const renderTaskList = (tasks: AppTask[], onTaskClick: (task: AppTask) => void) => {
  if (tasks.length === 0) {
    return <p className="text-center py-8 text-white/70">No tasks found.</p>;
  }
  
  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <div 
          key={task.id} 
          onClick={() => onTaskClick(task)}
          className="p-3 border border-white/20 rounded-md hover:bg-white/10 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-white">{task.title}</h3>
              {task.dueDate && (
                <p className="text-sm text-white/70">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className={`px-2 py-1 rounded-md text-xs ${
              task.status === 'completed' ? 'bg-green-800/50 text-green-100' :
              task.status === 'in-progress' ? 'bg-blue-800/50 text-blue-100' :
              task.status === 'pending' ? 'bg-amber-800/50 text-amber-100' :
              'bg-gray-800/50 text-gray-100'
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
};

export default TaskManagement;
