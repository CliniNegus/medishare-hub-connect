
import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DarkModeToggleProps {
  className?: string;
  iconClassName?: string;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ 
  className, 
  iconClassName 
}) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage first
    const savedMode = localStorage.getItem('dark-mode');
    
    // Then check user's system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    const initialDarkMode = savedMode ? savedMode === 'true' : prefersDark;
    setDarkMode(initialDarkMode);
    
    // Apply theme
    applyTheme(initialDarkMode);
    
    // Listen for system changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newDarkMode = e.matches;
      // Only update if user hasn't manually set a preference
      if (localStorage.getItem('dark-mode') === null) {
        setDarkMode(newDarkMode);
        applyTheme(newDarkMode);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('dark-mode', String(newDarkMode));
    applyTheme(newDarkMode);
  };
  
  const applyTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className={className}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <Sun className={`h-[1.2rem] w-[1.2rem] ${iconClassName}`} />
            ) : (
              <Moon className={`h-[1.2rem] w-[1.2rem] ${iconClassName}`} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{darkMode ? 'Switch to light mode' : 'Switch to dark mode'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DarkModeToggle;
