
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, ChevronDown, UserCircle, LogOut, Settings } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-white z-40 flex items-center px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <Link to="/" className="font-semibold text-lg flex-shrink-0">
          LYZ Law Firm
        </Link>
      </div>

      <div className="flex-1"></div>

      <nav className="hidden md:flex items-center gap-6 mr-6">
        <Link to="/dashboard" className="text-sm font-medium hover:text-primary">
          Dashboard
        </Link>
        <Link to="/cases" className="text-sm font-medium hover:text-primary">
          Cases
        </Link>
        <Link to="/documents" className="text-sm font-medium hover:text-primary">
          Documents
        </Link>
        <Link to="/calendar" className="text-sm font-medium hover:text-primary">
          Calendar
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                <span className="hidden md:inline">
                  {currentUser?.name || currentUser?.email || 'User'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer flex items-center w-full">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer flex items-center w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              
              {/* Role-specific menu items */}
              {currentUser?.role === 'admin' && (
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="cursor-pointer flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                </DropdownMenuItem>
              )}
              
              {currentUser?.role === 'superadmin' && (
                <DropdownMenuItem asChild>
                  <Link to="/super-admin" className="cursor-pointer flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Super Admin</span>
                  </Link>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/login">
            <Button variant="outline">Log In</Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
