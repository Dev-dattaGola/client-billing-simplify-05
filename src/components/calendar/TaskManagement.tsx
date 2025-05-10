
// Implementation for TaskManagement.tsx
// We're fixing the type issues with Task[] and ensuring status values match expected values

import React, { useState, useEffect } from "react";
import { tasksApi, Task } from "@/lib/api/calendar-api"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskForm } from "./TaskForm";
import { TaskDetails } from "./TaskDetails";
import { Loader2, Plus } from "lucide-react";

interface TaskManagementProps {
  // Add props as needed
}

const TaskManagement: React.FC<TaskManagementProps> = () => {
  // Use the correct Task type from calendar-api
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const fetchedTasks = await tasksApi.getTasks();
        // Convert the fetched tasks to match our internal type
        setTasks(fetchedTasks);
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
  
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsAddingTask(false);
  };
  
  const handleTaskSave = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Fix for status types: ensure it uses the correct values
      // Make sure taskData.status is one of 'todo', 'in-progress', or 'completed'
      const validStatus = taskData.status === 'pending' ? 'todo' : 
                        taskData.status === 'cancelled' ? 'todo' : 
                        taskData.status;
      
      const newTask = await tasksApi.createTask({
        ...taskData,
        status: validStatus as 'todo' | 'in-progress' | 'completed'
      });
      
      setTasks(prevTasks => [...prevTasks, newTask]);
      setIsAddingTask(false);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };
  
  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      // Ensure valid status values
      if (updates.status) {
        if (!['todo', 'in-progress', 'completed'].includes(updates.status)) {
          updates.status = 'todo';
        }
      }
      
      const updatedTask = await tasksApi.updateTask(taskId, updates);
      setTasks(prevTasks => prevTasks.map(task => task.id === taskId ? updatedTask : task));
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
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
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="todo">To Do</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {renderTaskList(tasks, handleTaskClick)}
            </TabsContent>
            
            <TabsContent value="todo">
              {renderTaskList(tasks.filter(task => task.status === 'todo'), handleTaskClick)}
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

const renderTaskList = (tasks: Task[], onTaskClick: (task: Task) => void) => {
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
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className={`px-2 py-1 rounded-md text-xs ${
              task.status === 'completed' ? 'bg-green-100 text-green-800' :
              task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
              'bg-amber-100 text-amber-800'
            }`}>
              {task.status === 'todo' ? 'To Do' : 
               task.status === 'in-progress' ? 'In Progress' : 
               'Completed'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskManagement;
