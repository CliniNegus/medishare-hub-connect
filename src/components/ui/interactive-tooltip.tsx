
import React, { ReactNode, useState } from 'react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { X, HelpCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InteractiveTooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  className?: string;
  iconClassName?: string;
  iconType?: 'help' | 'info' | 'custom' | 'none';
  customIcon?: ReactNode;
  interactive?: boolean;
  showDismiss?: boolean;
  persistent?: boolean;
  maxWidth?: string;
  id?: string;
  highlightTarget?: boolean;
}

export const InteractiveTooltip: React.FC<InteractiveTooltipProps> = ({
  content,
  children,
  side = 'top',
  align = 'center',
  className,
  iconClassName,
  iconType = 'help',
  customIcon,
  interactive = false,
  showDismiss = false,
  persistent = false,
  maxWidth = '320px',
  id,
  highlightTarget = false,
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(persistent);
  
  // If it's been dismissed and it's not interactive, don't render
  if (dismissed && !interactive) {
    return <>{children}</>;
  }
  
  // Generate the icon based on the iconType
  const renderIcon = () => {
    if (iconType === 'none') return null;
    
    if (iconType === 'custom' && customIcon) {
      return customIcon;
    }
    
    const IconComponent = iconType === 'info' ? Info : HelpCircle;
    
    return (
      <IconComponent className={cn(
        "h-4 w-4 text-red-600 dark:text-red-400", 
        iconClassName
      )} />
    );
  };
  
  return (
    <TooltipProvider>
      <Tooltip 
        open={persistent ? open : undefined} 
        onOpenChange={persistent ? setOpen : undefined}
      >
        <TooltipTrigger asChild>
          <div className={cn(
            "inline-flex items-center", 
            highlightTarget && "guide-highlight",
            className
          )}>
            {iconType !== 'none' && (
              <span className="inline-flex items-center ml-1 cursor-help">
                {renderIcon()}
              </span>
            )}
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align}
          className={cn(
            "p-4 tooltip-interactive z-50",
            interactive && "cursor-auto"
          )}
          style={{ maxWidth }}
          id={id}
        >
          <div className="relative">
            {showDismiss && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-5 w-5 -mr-2 -mt-2 rounded-full"
                onClick={() => {
                  setDismissed(true);
                  if (persistent) setOpen(false);
                }}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Close</span>
              </Button>
            )}
            <div>{content}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InteractiveTooltip;
