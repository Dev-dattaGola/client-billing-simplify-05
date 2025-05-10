
import React, { useState, useEffect } from "react";
import {
  Bell,
  Check,
  Trash,
  XCircle,
  Info,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useNotifications, Notification } from "@/lib/services/NotificationService";

const NotificationsMenu: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();
  const notificationService = useNotifications();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const allNotifications = notificationService.getNotifications();
    setNotifications(allNotifications);
    setUnreadCount(notificationService.getUnreadCount());
  };

  const handleMarkAllAsRead = () => {
    const count = notificationService.markAllAsRead();
    loadNotifications();
    
    if (count > 0) {
      toast({
        title: "Notifications Cleared",
        description: `${count} notification${count !== 1 ? 's' : ''} marked as read.`,
      });
    }
  };
  
  const handleDeleteAllNotifications = () => {
    const count = notificationService.deleteAllNotifications();
    loadNotifications();
    
    if (count > 0) {
      toast({
        title: "Notifications Deleted",
        description: `${count} notification${count !== 1 ? 's' : ''} deleted.`,
      });
    }
  };

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id);
    loadNotifications();
  };
  
  const handleDeleteNotification = (id: string) => {
    notificationService.deleteNotification(id);
    loadNotifications();
    
    toast({
      title: "Notification Deleted",
      description: "The notification has been deleted.",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  // Add some demo notifications for testing
  useEffect(() => {
    if (notifications.length === 0) {
      notificationService.createNotification(
        "Welcome to LAWerp500",
        "Thank you for using our legal practice management system.",
        "info"
      );
      
      notificationService.createNotification(
        "Document Ready",
        "The settlement agreement has been prepared and is ready for review.",
        "success"
      );
      
      notificationService.createNotification(
        "Upcoming Deposition",
        "Reminder: You have a deposition scheduled for tomorrow at 2:00 PM.",
        "warning"
      );
      
      loadNotifications();
    }
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all as read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={handleDeleteAllNotifications}
              disabled={notifications.length === 0}
            >
              <Trash className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          </div>
        </div>
        
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center text-muted-foreground">
              <Bell className="h-10 w-10 mb-2 text-muted-foreground/50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "px-4 py-3 border-b last:border-0",
                  !notification.isRead && "bg-muted/40"
                )}
              >
                <div className="flex gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm">
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-1">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3" />
                            <span className="sr-only">Mark as read</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          <Trash className="h-3 w-3" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <time className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
                    </time>
                  </div>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsMenu;
