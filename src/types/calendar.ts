
import { z } from "zod";

export const taskPriorityEnum = z.enum(["low", "medium", "high"]);
export type TaskPriority = z.infer<typeof taskPriorityEnum>;

export const taskStatusEnum = z.enum(["pending", "in-progress", "completed", "cancelled"]);
export type TaskStatus = z.infer<typeof taskStatusEnum>;

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string;
  reminder?: Date;
  caseId?: string;
  clientId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  color?: string;
  reminderTime?: Date;
  location?: string;
  participants?: string[];
  relatedTaskId?: string;
  relatedCaseId?: string;
  createdBy?: string; // ID of the user who created the event
  createdAt: Date;
  updatedAt: Date;
}
