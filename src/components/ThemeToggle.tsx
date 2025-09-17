
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4 text-muted-foreground" />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-clinibuilds-red"
      />
      <Moon className="h-4 w-4 text-muted-foreground" />
      <Label className="sr-only">Toggle theme</Label>
    </div>
  );
}

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative border-border bg-background hover:bg-accent dark:border-border dark:bg-card dark:hover:bg-accent"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
