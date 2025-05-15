
import React from 'react';
import { NavLink } from 'react-router-dom';
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
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, isCollapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
          isActive
            ? 'bg-primary/10 text-primary font-medium'
            : 'hover:bg-muted'
        }`
      }
    >
      <div>{icon}</div>
      {!isCollapsed && <span>{label}</span>}
    </NavLink>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { currentUser } = useAuth();

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 z-30 flex flex-col border-r bg-white transition-all duration-300 
        ${isCollapsed ? 'w-14' : 'w-56'}`}
    >
      <div className="flex flex-col flex-1 p-2 overflow-y-auto">
        <SidebarLink
          to="/dashboard"
          icon={<Home className="h-5 w-5" />}
          label="Dashboard"
          isCollapsed={isCollapsed}
        />

        {/* Common links for all users */}
        <SidebarLink
          to="/documents"
          icon={<FileText className="h-5 w-5" />}
          label="Documents"
          isCollapsed={isCollapsed}
        />

        <SidebarLink
          to="/calendar"
          icon={<Calendar className="h-5 w-5" />}
          label="Calendar"
          isCollapsed={isCollapsed}
        />

        <SidebarLink
          to="/messages"
          icon={<MessageSquare className="h-5 w-5" />}
          label="Messages"
          isCollapsed={isCollapsed}
        />

        {/* Attorney and Admin links */}
        {(currentUser?.role === 'attorney' || 
          currentUser?.role === 'admin' || 
          currentUser?.role === 'superadmin') && (
          <>
            <div className={`mt-6 mb-2 ${isCollapsed ? 'px-3' : 'px-3 text-xs font-semibold'}`}>
              {!isCollapsed && 'Management'}
            </div>

            <SidebarLink
              to="/clients"
              icon={<Users className="h-5 w-5" />}
              label="Clients"
              isCollapsed={isCollapsed}
            />

            <SidebarLink
              to="/cases"
              icon={<FolderOpen className="h-5 w-5" />}
              label="Cases"
              isCollapsed={isCollapsed}
            />
          </>
        )}

        {/* Admin only links */}
        {(currentUser?.role === 'admin' || currentUser?.role === 'superadmin') && (
          <>
            <div className={`mt-6 mb-2 ${isCollapsed ? 'px-3' : 'px-3 text-xs font-semibold'}`}>
              {!isCollapsed && 'Administration'}
            </div>

            <SidebarLink
              to="/admin"
              icon={<Settings className="h-5 w-5" />}
              label="Admin Panel"
              isCollapsed={isCollapsed}
            />
          </>
        )}

        {/* Super Admin only links */}
        {currentUser?.role === 'superadmin' && (
          <SidebarLink
            to="/super-admin"
            icon={<Shield className="h-5 w-5" />}
            label="Super Admin"
            isCollapsed={isCollapsed}
          />
        )}
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
