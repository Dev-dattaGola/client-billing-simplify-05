
import { v4 as uuidv4 } from 'uuid';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  userId?: string;
  link?: string;
}

class NotificationService {
  private static instance: NotificationService;
  private notifications: Map<string, Notification> = new Map();
  
  // Use singleton pattern to ensure we have only one instance
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
      NotificationService.instance.loadNotifications();
    }
    return NotificationService.instance;
  }
  
  // Create a new notification
  public createNotification(
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error',
    userId?: string,
    link?: string
  ): Notification {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const notification: Notification = {
      id,
      title,
      message,
      type,
      isRead: false,
      createdAt: now,
      userId,
      link
    };
    
    this.notifications.set(id, notification);
    this.saveNotifications();
    
    return notification;
  }
  
  // Get all notifications
  public getNotifications(userId?: string): Notification[] {
    const allNotifications = Array.from(this.notifications.values());
    
    if (userId) {
      return allNotifications.filter(notification => 
        !notification.userId || notification.userId === userId
      ).sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    
    return allNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  
  // Get unread notifications count
  public getUnreadCount(userId?: string): number {
    const notifications = this.getNotifications(userId);
    return notifications.filter(notification => !notification.isRead).length;
  }
  
  // Mark a notification as read
  public markAsRead(id: string): boolean {
    const notification = this.notifications.get(id);
    
    if (!notification) {
      return false;
    }
    
    notification.isRead = true;
    this.notifications.set(id, notification);
    this.saveNotifications();
    
    return true;
  }
  
  // Mark all notifications as read
  public markAllAsRead(userId?: string): number {
    const notifications = this.getNotifications(userId);
    let count = 0;
    
    notifications.forEach(notification => {
      if (!notification.isRead) {
        notification.isRead = true;
        this.notifications.set(notification.id, notification);
        count++;
      }
    });
    
    if (count > 0) {
      this.saveNotifications();
    }
    
    return count;
  }
  
  // Delete a notification
  public deleteNotification(id: string): boolean {
    const result = this.notifications.delete(id);
    
    if (result) {
      this.saveNotifications();
    }
    
    return result;
  }
  
  // Delete all notifications
  public deleteAllNotifications(userId?: string): number {
    const notifications = this.getNotifications(userId);
    let count = 0;
    
    notifications.forEach(notification => {
      if (!userId || !notification.userId || notification.userId === userId) {
        this.notifications.delete(notification.id);
        count++;
      }
    });
    
    if (count > 0) {
      this.saveNotifications();
    }
    
    return count;
  }
  
  // Save notifications to localStorage
  private saveNotifications(): void {
    try {
      const notificationsArray = Array.from(this.notifications.entries());
      localStorage.setItem('notifications', JSON.stringify(notificationsArray));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }
  
  // Load notifications from localStorage
  private loadNotifications(): void {
    try {
      const notificationsJson = localStorage.getItem('notifications');
      
      if (notificationsJson) {
        const notificationsArray = JSON.parse(notificationsJson);
        
        for (const [id, notification] of notificationsArray) {
          this.notifications.set(id, notification);
        }
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }
}

export default NotificationService;

// React hook to use notifications
export const useNotifications = () => {
  const notificationService = NotificationService.getInstance();
  
  return {
    createNotification: notificationService.createNotification.bind(notificationService),
    getNotifications: notificationService.getNotifications.bind(notificationService),
    getUnreadCount: notificationService.getUnreadCount.bind(notificationService),
    markAsRead: notificationService.markAsRead.bind(notificationService),
    markAllAsRead: notificationService.markAllAsRead.bind(notificationService),
    deleteNotification: notificationService.deleteNotification.bind(notificationService),
    deleteAllNotifications: notificationService.deleteAllNotifications.bind(notificationService)
  };
};
