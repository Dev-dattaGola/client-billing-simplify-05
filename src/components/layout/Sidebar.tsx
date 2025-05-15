
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  FileText,
  Calendar,
  MessageSquare,
  Users,
  FolderOpen,
  Settings,
  Shield,
  ChevronRight,
  ChevronLeft,
  Building2,
  BarChart,
  Calculator,
  FileSearch,
  Gavel
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  const isAdmin = currentUser?.role === 'admin';
  const isSuperAdmin = currentUser?.role === 'superadmin';
  const isAttorney = currentUser?.role === 'attorney';
  const isClient = currentUser?.role === 'client';

  // Define navigation items with role-based access
  const navItems = [
    { 
      title: 'Dashboard', 
      path: '/dashboard', 
      icon: <Home className="h-5 w-5" />,
      roles: ['admin', 'attorney', 'client', 'superadmin'] 
    },
    { 
      title: 'Clients', 
      path: '/clients', 
      icon: <Users className="h-5 w-5" />,
      roles: ['admin', 'attorney'] 
    },
    { 
      title: 'Cases', 
      path: '/cases', 
      icon: <FolderOpen className="h-5 w-5" />,
      roles: ['admin', 'attorney'] 
    },
    { 
      title: 'Documents', 
      path: '/documents', 
      icon: <FileText className="h-5 w-5" />,
      roles: ['admin', 'attorney', 'client'] 
    },
    { 
      title: 'Files', 
      path: '/files', 
      icon: <FileSearch className="h-5 w-5" />,
      roles: ['admin', 'attorney'] 
    },
    { 
      title: 'Medical', 
      path: '/medical', 
      icon: <Building2 className="h-5 w-5" />,
      roles: ['admin', 'attorney'] 
    },
    { 
      title: 'Billing', 
      path: '/billing', 
      icon: <BarChart className="h-5 w-5" />,
      roles: ['admin', 'attorney'] 
    },
    { 
      title: 'Calculator', 
      path: '/calculator', 
      icon: <Calculator className="h-5 w-5" />,
      roles: ['admin', 'attorney'] 
    },
    { 
      title: 'Reports', 
      path: '/reports', 
      icon: <FileSearch className="h-5 w-5" />,
      roles: ['admin', 'attorney'] 
    },
    { 
      title: 'Calendar', 
      path: '/calendar', 
      icon: <Calendar className="h-5 w-5" />,
      roles: ['admin', 'attorney', 'client'] 
    },
    { 
      title: 'Messages', 
      path: '/messages', 
      icon: <MessageSquare className="h-5 w-5" />,
      roles: ['admin', 'attorney', 'client'] 
    },
    { 
      title: 'Depositions', 
      path: '/depositions', 
      icon: <Gavel className="h-5 w-5" />,
      roles: ['admin', 'attorney'] 
    }
  ];

  // Admin-only items
  const adminItems = [
    { 
      title: 'Firm Management', 
      path: '/firm-management', 
      icon: <Building2 className="h-5 w-5" />,
      roles: ['admin'] 
    },
    { 
      title: 'Admin', 
      path: '/admin', 
      icon: <Shield className="h-5 w-5" />,
      roles: ['admin'] 
    }
  ];

  // Super Admin-only items
  const superAdminItems = [
    { 
      title: 'Super Admin', 
      path: '/super-admin', 
      icon: <Shield className="h-5 w-5" />,
      roles: ['superadmin'] 
    }
  ];

  // Settings is available to all users
  const settingsItem = { 
    title: 'Settings', 
    path: '/settings', 
    icon: <Settings className="h-5 w-5" />,
    roles: ['admin', 'attorney', 'client', 'superadmin'] 
  };
  
  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );
  
  const filteredAdminItems = adminItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );
  
  const filteredSuperAdminItems = superAdminItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );
  
  const renderNavItem = (item: { title: string, path: string, icon: JSX.Element }) => {
    return (
      <li key={item.path}>
        <NavLink
          to={item.path}
          className={({ isActive }) => cn(
            "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
            isActive
              ? "bg-primary/10 text-primary font-medium"
              : "hover:bg-muted"
          )}
          end
        >
          {item.icon}
          {!isCollapsed && <span>{item.title}</span>}
        </NavLink>
      </li>
    );
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 bottom-0 z-30 flex flex-col border-r bg-white transition-all duration-300",
        isCollapsed ? "w-14" : "w-56"
      )}
    >
      <div className="flex flex-col flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {filteredNavItems.map(renderNavItem)}
        </ul>
        
        {/* Admin section */}
        {filteredAdminItems.length > 0 && (
          <>
            <div className={cn("mt-6 mb-2 px-3", 
              isCollapsed ? "text-xs" : "text-xs font-semibold"
            )}>
              {!isCollapsed && "Administration"}
            </div>
            <ul className="space-y-1">
              {filteredAdminItems.map(renderNavItem)}
            </ul>
          </>
        )}
        
        {/* Super Admin section */}
        {filteredSuperAdminItems.length > 0 && (
          <>
            <div className={cn("mt-6 mb-2 px-3", 
              isCollapsed ? "text-xs" : "text-xs font-semibold"
            )}>
              {!isCollapsed && "Super Admin"}
            </div>
            <ul className="space-y-1">
              {filteredSuperAdminItems.map(renderNavItem)}
            </ul>
          </>
        )}

        {/* Settings - always shown */}
        <div className="mt-auto pt-4">
          <ul className="space-y-1">
            {renderNavItem(settingsItem)}
          </ul>
        </div>
      </div>

      {/* Collapse toggle */}
      <div className="p-2 border-t">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex w-full items-center justify-center p-2 rounded-md hover:bg-gray-100"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
