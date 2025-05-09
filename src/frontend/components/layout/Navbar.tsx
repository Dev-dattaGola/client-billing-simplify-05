
import React, { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const [searchValue, setSearchValue] = useState("");
  const { logout, currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      toast({
        title: "Search",
        description: `Searching for "${searchValue}"...`,
      });
    }
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-[#8A2BE2] backdrop-blur supports-[backdrop-filter]:bg-[#8A2BE2]/60"
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6 text-white">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden text-white hover:bg-[#9F5AE0]">
            <Menu className="h-5 w-5 text-white" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="font-semibold text-xl flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center text-white">
              <img/>
            </div>
            
          </div>
        </div>
        
        <div className="hidden md:flex flex-1 mx-8 relative">
          <form onSubmit={handleSearch} className="w-full max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/70" />
              <Input
                type="search"
                placeholder="Search cases, clients, documents..."
                className="w-full bg-white/20 text-white placeholder:text-white pl-8 md:w-[300px] lg:w-[400px] border-white/30 focus:border-white/40"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </form>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-white/20 text-white">
                    {currentUser?.name?.substring(0, 2).toUpperCase() || "LF"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
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
            className="w-full pl-8 bg-white/20 text-white placeholder:text-white border-white/30"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
