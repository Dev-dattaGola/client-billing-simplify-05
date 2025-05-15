
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Plus, Mail, User, Settings, Search, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import CommandSearch from "./CommandSearch";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const [searchValue, setSearchValue] = useState("");
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle keyboard shortcut for command palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen(open => !open);
      }
    };

    document.addEventListener("keydown", down as any);
    return () => document.removeEventListener("keydown", down as any);
  }, []);

  const handleSearchFocus = () => {
    setIsCommandOpen(true);
  };

  const notifications = [
    { id: 1, title: "New client added", description: "James Peterson was added as a client", time: "10 min ago", unread: true },
    { id: 2, title: "Document update", description: "Insurance document for Maria Rodriguez was updated", time: "30 min ago", unread: true },
    { id: 3, title: "Billing reminder", description: "Client billing for May is due tomorrow", time: "1 hour ago", unread: false },
  ];

  const messages = [
    { id: 1, from: "Robert Johnson", message: "Can you send me the latest case details?", time: "15 min ago", unread: true },
    { id: 2, from: "Sarah Williams", message: "Thanks for the update on my case.", time: "1 hour ago", unread: true },
    { id: 3, from: "David Miller", message: "When will the medical report be ready?", time: "3 hours ago", unread: false },
  ];

  const handleReadAllNotifications = () => {
    toast({
      title: "Marked all as read",
      description: "All notifications have been marked as read"
    });
  };

  const handleReadAllMessages = () => {
    toast({
      title: "Marked all as read",
      description: "All messages have been marked as read"
    });
  };
  
  const handleQuickAction = (action: string) => {
    toast({
      title: action,
      description: `${action} feature has been triggered`,
    });
    
    // Navigate based on the action
    switch(action) {
      case "Add new client":
        navigate("/clients/new");
        break;
      case "Create new billing":
        navigate("/billing/new");
        break;
      case "Upload document":
        navigate("/documents?tab=upload");
        break;
      case "Generate report":
        navigate("/reports");
        break;
      default:
        break;
    }
  };

  const handleReplyToMessage = (from: string) => {
    toast({ 
      title: `Replied to ${from}`,
      description: `Your reply has been sent to ${from}`
    });
  };

  const handleSettingsAction = (setting: string) => {
    toast({ 
      title: `${setting} opened`,
      description: `Opening ${setting.toLowerCase()} preferences`
    });
    navigate("/settings");
  };

  return (
    <>
      <CommandSearch open={isCommandOpen} onOpenChange={setIsCommandOpen} />
      
      <header 
        className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-[#8A2BE2] backdrop-blur supports-[backdrop-filter]:bg-[#8A2BE2]/60"
        style={{ backgroundColor: '#8A2BE2' }}
      >
        <div className="flex h-16 items-center justify-between px-4 md:px-6 text-white">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden text-white hover:bg-[#9F5AE0]">
              <Menu className="h-5 w-5 text-white" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <div className="font-semibold text-xl flex items-center gap-2">
              <img 
                src="/lovable-uploads/f821edb6-2ada-465d-a812-7f4c9e81f81d.png" 
                alt="LAWerp500 Logo" 
                className="h-32"
              />
              
            </div>
          </div>
          
          <div className="hidden md:flex flex-1 mx-8 relative">
            <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/70" />
                <Input
                  type="search"
                  placeholder="Search cases, clients, documents... (Ctrl+K)"
                  className="w-full bg-white/20 text-white placeholder:text-white pl-8 md:w-[300px] lg:w-[400px] border-white/30 focus:border-white/40"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={handleSearchFocus}
                />
              </div>
            </form>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-[#9F5AE0]">
                  <Plus className="h-5 w-5 text-white" />
                  <span className="sr-only">Quick Actions</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Quick Actions</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <Button className="w-full" onClick={() => handleQuickAction("Add new client")}>
                    Add New Client
                  </Button>
                  <Button className="w-full" onClick={() => handleQuickAction("Create new billing")}>
                    Create New Billing
                  </Button>
                  <Button className="w-full" onClick={() => handleQuickAction("Upload document")}>
                    Upload Document
                  </Button>
                  <Button className="w-full" onClick={() => handleQuickAction("Generate report")}>
                    Generate Report
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-[#9F5AE0] relative">
                  <Bell className="h-5 w-5 text-white" />
                  {notifications.filter(n => n.unread).length > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                      {notifications.filter(n => n.unread).length}
                    </Badge>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <div className="flex items-center justify-between">
                    <SheetTitle>Notifications</SheetTitle>
                    <Button variant="ghost" size="sm" onClick={handleReadAllNotifications}>
                      Mark all as read
                    </Button>
                  </div>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={cn(
                          "p-3 rounded-lg border",
                          notification.unread ? "bg-muted/50 border-muted-foreground/20" : "border-transparent"
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className={cn("text-sm font-medium", notification.unread && "font-semibold")}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                        <p className="text-sm mt-1 text-muted-foreground">{notification.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No notifications</p>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-[#9F5AE0] relative">
                  <Mail className="h-5 w-5 text-white" />
                  {messages.filter(m => m.unread).length > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                      {messages.filter(m => m.unread).length}
                    </Badge>
                  )}
                  <span className="sr-only">Messages</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <div className="flex items-center justify-between">
                    <SheetTitle>Messages</SheetTitle>
                    <Button variant="ghost" size="sm" onClick={handleReadAllMessages}>
                      Mark all as read
                    </Button>
                  </div>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={cn(
                          "p-3 rounded-lg border",
                          message.unread ? "bg-muted/50 border-muted-foreground/20" : "border-transparent"
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className={cn("text-sm font-medium", message.unread && "font-semibold")}>
                            {message.from}
                          </h4>
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                        </div>
                        <p className="text-sm mt-1 text-muted-foreground">{message.message}</p>
                        <div className="mt-2 flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleReplyToMessage(message.from)}
                          >
                            Reply
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No messages</p>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-[#9F5AE0]">
                  <Settings className="h-5 w-5 text-white" />
                  <span className="sr-only">Settings</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Settings</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Account Settings</h4>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={() => handleSettingsAction("Profile settings")}
                      >
                        Profile Settings
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={() => handleSettingsAction("Notification preferences")}
                      >
                        Notification Preferences
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">System Settings</h4>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={() => handleSettingsAction("Display settings")}
                      >
                        Display & Accessibility
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={() => handleSettingsAction("Security settings")}
                      >
                        Security & Privacy
                      </Button>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        variant="destructive" 
                        className="w-full" 
                        onClick={logout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-[#9F5AE0]">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-white/20 text-white">AT</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSettingsAction("Profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSettingsAction("Settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="md:hidden px-4 pb-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/70" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-8 bg-white/20 text-white placeholder:text-white border-white/30 focus:border-white/40 hover:bg-white/30"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={handleSearchFocus}
            />
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
