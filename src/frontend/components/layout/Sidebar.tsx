import React from 'react';
import { NavLink } from 'react-router-dom';
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
  Shield
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { hasPermission, currentUser } = useAuth();
  
  const navItems = [
    { 
      title: 'Dashboard', 
      path: '/dashboard', 
      icon: <Home size={20} />,
      permissions: [] // Accessible to all
    },
    { 
      title: 'Clients', 
      path: '/clients', 
      icon: <Users size={20} />,
      permissions: ['view:clients', 'access:all'] 
    },
    { 
      title: 'Cases', 
      path: '/cases', 
      icon: <Folder size={20} />,
      permissions: ['view:cases', 'access:all'] 
    },
    { 
      title: 'Documents', 
      path: '/documents', 
      icon: <FileText size={20} />,
      permissions: ['view:documents', 'upload:documents', 'access:all'] 
    },
    { 
      title: 'Files', 
      path: '/files', 
      icon: <FileSearch size={20} />,
      permissions: ['view:documents', 'access:all'] 
    },
    { 
      title: 'Medical', 
      path: '/medical', 
      icon: <Building2 size={20} />,
      permissions: ['view:medical', 'access:all'] 
    },
    { 
      title: 'Billing', 
      path: '/billing', 
      icon: <BarChart size={20} />,
      permissions: ['view:billing', 'access:all'] 
    },
    { 
      title: 'Calculator', 
      path: '/calculator', 
      icon: <Calculator size={20} />,
      permissions: ['view:cases', 'access:all'] 
    },
    { 
      title: 'Reports', 
      path: '/reports', 
      icon: <FileSearch size={20} />,
      permissions: ['view:cases', 'access:all'] 
    },
    { 
      title: 'Calendar', 
      path: '/calendar', 
      icon: <Calendar size={20} />,
      permissions: ['view:calendar', 'view:appointments', 'access:all'] 
    },
    { 
      title: 'Messages', 
      path: '/messages', 
      icon: <MessageSquare size={20} />,
      permissions: ['view:messages', 'send:messages', 'access:all'] 
    },
    { 
      title: 'Admin', 
      path: '/admin', 
      icon: <Shield size={20} />,
      permissions: ['manage:users', 'access:all'] 
    },
    { 
      title: 'Depositions', 
      path: '/depositions', 
      icon: <Gavel size={20} />,
      permissions: ['view:depositions', 'access:all'] 
    },
    { 
      title: 'Attorneys', 
      path: '/attorneys', 
      icon: <Users size={20} />,
      permissions: ['manage:users', 'access:all'] 
    },
    { 
      title: 'Settings', 
      path: '/settings', 
      icon: <Settings size={20} />,
      permissions: [] // Accessible to all
    }
  ];

  return (
    <div 
      className={cn(
        "border-r border-border h-screen transition-all duration-300 flex flex-col bg-background",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      <div className="p-3 flex items-center gap-2 border-b">
        <div className="bg-lawfirm-light-blue text-white w-10 h-10 flex items-center justify-center rounded font-bold text-lg">
          LYZ
        </div>
        {!isCollapsed && <div className="font-semibold">LYZ Law Firm</div>}
      </div>

      <div className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto">
        {navItems
          .filter(item => item.permissions.length === 0 || item.permissions.some(perm => hasPermission(perm)))
          .map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
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
            <div className="font-medium">{currentUser.name}</div>
            <div>{currentUser.email}</div>
            <div className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs inline-block mt-1">
              {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
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
