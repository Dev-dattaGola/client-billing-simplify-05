
import React, { useEffect, useCallback, memo } from 'react';
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
  Shield
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

// Using memo to prevent unnecessary re-renders
const Sidebar = memo<SidebarProps>(({ isCollapsed, setIsCollapsed }) => {
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

  const getUserDisplayName = useCallback((user: any) => {
    if (!user) return "";
    // Try different ways to get the user's name
    return user.name || 
           (user.user_metadata?.first_name ? 
            `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}` : 
            user.email?.split('@')[0] || '');
  }, []);

  // Determine user role from user object consistently
  const getUserRole = useCallback((user: any) => {
    if (!user) return "";
    return user.role || user.user_metadata?.role || 'client';
  }, []);

  // Filter menu items based on user role
  const visibleNavItems = React.useMemo(() => {
    const userRole = currentUser?.role || currentUser?.user_metadata?.role || 'client';
    return roleBasedNavItems.filter(item => 
      !currentUser || item.roles.includes(userRole)
    );
  }, [currentUser, roleBasedNavItems]);

  return (
    <div 
      className={cn(
        "border-r border-border h-screen transition-all duration-300 flex flex-col bg-gray-100 dark:bg-gray-900 sticky top-0 z-10",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      <div className="p-3 flex items-center gap-2 border-b bg-lawfirm-purple text-white">
        <div className="bg-white text-lawfirm-purple w-10 h-10 flex items-center justify-center rounded font-bold text-lg">
          LAW
        </div>
        {!isCollapsed && <div className="font-semibold">LAWerp500</div>}
      </div>

      <div className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto">
        {visibleNavItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                "hover:bg-lawfirm-light-blue hover:text-lawfirm-dark-purple",
                isActive 
                  ? "bg-lawfirm-light-blue text-lawfirm-dark-purple font-medium" 
                  : "text-gray-700 dark:text-gray-300",
                isCollapsed && "justify-center px-0"
              )}
            >
              {item.icon}
              {!isCollapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </div>

      <div className="p-3 border-t mt-auto bg-gray-200 dark:bg-gray-800">
        {!isCollapsed && currentUser && (
          <div className="text-xs text-gray-700 dark:text-gray-300 mb-2">
            <div className="font-medium">{getUserDisplayName(currentUser)}</div>
            <div>{currentUser.email}</div>
            <div className="bg-lawfirm-light-blue text-lawfirm-dark-purple px-2 py-0.5 rounded-full text-xs inline-block mt-1">
              {getUserRole(currentUser).charAt(0).toUpperCase() + getUserRole(currentUser).slice(1)}
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center h-10 border rounded-md text-gray-700 dark:text-gray-300 hover:bg-lawfirm-light-blue hover:text-lawfirm-dark-purple transition-colors"
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>
    </div>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
