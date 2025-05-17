
import React, { useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  Users,
  FileText,
  Folder,
  Building2,
  Calendar,
  MessageSquare,
  Settings,
  BarChart,
  Calculator,
  Gavel,
  Shield
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { hasPermission, currentUser } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Define which roles can access which items
  const roleBasedNavItems = [
    { 
      title: 'Dashboard', 
      path: '/dashboard', 
      icon: <Home size={20} />,
      roles: ['admin', 'attorney', 'client'] // All users
    },
    { 
      title: 'Clients', 
      path: '/clients', 
      icon: <Users size={20} />,
      roles: ['admin', 'attorney'] 
    },
    { 
      title: 'Cases', 
      path: '/cases', 
      icon: <Folder size={20} />,
      roles: ['admin', 'attorney'] 
    },
    { 
      title: 'Documents', 
      path: '/documents', 
      icon: <FileText size={20} />,
      roles: ['admin', 'attorney', 'client'] // All users
    },
    { 
      title: 'Medical', 
      path: '/medical', 
      icon: <Building2 size={20} />,
      roles: ['admin', 'attorney'] 
    },
    { 
      title: 'Billing', 
      path: '/billing', 
      icon: <BarChart size={20} />,
      roles: ['admin', 'attorney'] 
    },
    { 
      title: 'Calculator', 
      path: '/calculator', 
      icon: <Calculator size={20} />,
      roles: ['admin', 'attorney'] 
    },
    { 
      title: 'Calendar', 
      path: '/calendar', 
      icon: <Calendar size={20} />,
      roles: ['admin', 'attorney', 'client'] // All users - clients can see appointments
    },
    { 
      title: 'Messages', 
      path: '/messages', 
      icon: <MessageSquare size={20} />,
      roles: ['admin', 'attorney', 'client'] // All users - clients can message attorneys
    },
    { 
      title: 'Admin', 
      path: '/admin', 
      icon: <Shield size={20} />,
      roles: ['admin'] // Admin only
    },
    { 
      title: 'Depositions', 
      path: '/depositions', 
      icon: <Gavel size={20} />,
      roles: ['admin', 'attorney'] 
    },
    { 
      title: 'Attorneys', 
      path: '/attorneys', 
      icon: <Users size={20} />,
      roles: ['admin'] // Admin only
    },
    { 
      title: 'Settings', 
      path: '/settings', 
      icon: <Settings size={20} />,
      roles: ['admin', 'attorney', 'client'] // All users
    }
  ];

  // Use useCallback for toggle function to prevent recreating on each render
  const toggleSidebar = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed, setIsCollapsed]);

  return (
    <div 
      className={cn(
        "border-r border-white/10 h-screen transition-all duration-300 flex flex-col glass-effect",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto">
        {roleBasedNavItems
          .filter(item => !currentUser || item.roles.includes(currentUser.role))
          .map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                "hover:bg-white/20 hover:text-white",
                isActive ? "bg-white/20 text-white" : "text-white/70",
                isCollapsed && "justify-center px-0"
              )}
            >
              {item.icon}
              {!isCollapsed && <span>{item.title}</span>}
            </NavLink>
          ))}
      </div>

      <div className="p-3 border-t border-white/10 mt-auto">
        {!isCollapsed && currentUser && (
          <div className="text-xs text-white/70 mb-2">
            <div className="font-medium">{currentUser.name}</div>
            <div>{currentUser.email}</div>
            <div className="bg-blue-500/30 text-blue-100 px-2 py-0.5 rounded-full text-xs inline-block mt-1 backdrop-blur-sm">
              {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center h-10 border border-white/20 rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors backdrop-blur-sm"
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>
    </div>
  );
};

export default React.memo(Sidebar);
