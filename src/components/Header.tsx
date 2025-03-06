
import React from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { useAuthContext } from '@/context/AuthContext';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Moon,
  Sun,
  UserCircle,
  Calendar,
  LogOut,
  Settings,
  LogIn,
  FileDown,
  ListTodo,
  CalendarDays
} from 'lucide-react';

interface HeaderProps {
  onShowLoginModal?: () => void;
  onShowListsModal?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowLoginModal, onShowListsModal }) => {
  const { theme, toggleTheme } = useThemeContext();
  const { user, logout } = useAuthContext();
  const { exportData } = useTaskContext();
  const navigate = useNavigate();
  
  const handleThemeToggle = () => {
    toggleTheme();
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const handleExport = (format: 'json' | 'csv') => {
    exportData(format);
  };
  
  return (
    <header className="px-4 py-2 border-b flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold">
          <ListTodo className="inline-block mr-2" />
          Planner
        </Link>
        
        {user && (
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/planner" className="text-sm hover:underline">
              <Calendar className="inline-block h-4 w-4 mr-1" />
              Week View
            </Link>
            <Link to="/date-view" className="text-sm hover:underline">
              <CalendarDays className="inline-block h-4 w-4 mr-1" />
              Date View
            </Link>
          </nav>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={handleThemeToggle}>
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        {user ? (
          <>
            {onShowListsModal && (
              <Button variant="ghost" size="sm" onClick={onShowListsModal}>
                Lists
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user.name || user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/planner')}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Week View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/date-view')}>
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Date View
                </DropdownMenuItem>
                {onShowListsModal && (
                  <DropdownMenuItem onClick={onShowListsModal}>
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Lists
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('json')}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export CSV
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button variant="ghost" size="sm" onClick={onShowLoginModal}>
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
