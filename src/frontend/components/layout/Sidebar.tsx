
import React from 'react';
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
  FileSearch,
  Gavel,
  Shield,
  UserMinus
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { hasPermission, currentUser } = useAuth();
  const location = useLocation();
  
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
      title: 'Dropped Clients', 
      path: '/dropped-clients', 
      icon: <UserMinus size={20} />,
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
      title: 'Files', 
      path: '/files', 
      icon: <FileSearch size={20} />,
      roles: ['admin', 'attorney'] 
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
      title: 'Reports', 
      path: '/reports', 
      icon: <FileSearch size={20} />,
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

  const getUserDisplayName = (user: any) => {
    if (!user) return "";
    // Try different ways to get the user's name
    return user.name || 
           (user.user_metadata?.first_name ? 
            `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}` : 
            user.email?.split('@')[0] || '');
  };

  const getUserRole = (user: any) => {
    if (!user) return "";
    return user.role || user.user_metadata?.role || 'client';
  };

  return (
    <div 
      className={cn(
        "border-r border-border h-screen transition-all duration-300 flex flex-col bg-background",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      <div className="p-3 flex items-center gap-2 border-b">
        <div className="bg-violet-600 text-white w-10 h-10 flex items-center justify-center rounded font-bold text-lg">
          LAW
        </div>
        {!isCollapsed && <div className="font-semibold">LAWerp500</div>}
      </div>

      <div className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto">
        {roleBasedNavItems
          .filter(item => {
            const userRole = getUserRole(currentUser);
            return !currentUser || item.roles.includes(userRole);
          })
          .map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/clients' || item.path === '/dashboard'}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                isCollapsed && "justify-center px-0"
              )}
            >
              {item.icon}
              {!isCollapsed && <span>{item.title}</span>}
            </NavLink>
          ))}
      </div>

      <div className="p-3 border-t mt-auto">
        {!isCollapsed && currentUser && (
          <div className="text-xs text-muted-foreground mb-2">
            <div className="font-medium">{getUserDisplayName(currentUser)}</div>
            <div>{currentUser.email}</div>
            <div className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs inline-block mt-1">
              {getUserRole(currentUser).charAt(0).toUpperCase() + getUserRole(currentUser).slice(1)}
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center h-10 border rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
