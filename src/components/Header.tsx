
import React from 'react';
import { Button } from '@/components/ui/button';
import { useThemeContext } from '@/context/ThemeContext';
import { useAuthContext } from '@/context/AuthContext';
import { Sun, Moon, User, LogOut, Save, Upload, List } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onShowListsModal: () => void;
  onShowLoginModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowListsModal, onShowLoginModal }) => {
  const { theme, toggleTheme } = useThemeContext();
  const { user, logout } = useAuthContext();
  const { exportData } = useTaskContext();
  
  return (
    <header className="border-b border-border p-4">
      <div className="container flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Minimalist Weekly Planner</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onShowListsModal}
            title="Manage Lists"
          >
            <List className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                title="Export Data"
              >
                <Save className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => exportData('json')}>
                <Save className="h-4 w-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportData('csv')}>
                <Upload className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                >
                  <User className="h-4 w-4 mr-2" />
                  {user.name || user.email.split('@')[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onShowLoginModal}
              className="ml-2"
            >
              <User className="h-4 w-4 mr-2" />
              Log In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
