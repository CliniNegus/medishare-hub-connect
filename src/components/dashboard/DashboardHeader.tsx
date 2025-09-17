
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from '@/components/ThemeToggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dispatch, SetStateAction } from 'react';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  activeTab?: string;
  setActiveTab?: Dispatch<SetStateAction<string>>;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  activeTab,
  setActiveTab
}) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} justify-between items-${isMobile ? 'start' : 'center'} mb-4 sm:mb-6 gap-4`}>
      <div className="min-w-0 flex-1">
        <h1 className="text-xl sm:text-2xl font-bold truncate">{title}</h1>
        {subtitle && <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">{subtitle}</p>}
      </div>
      
      <div className={`flex items-center space-x-2 w-full ${isMobile ? '' : 'w-auto'} ${isMobile ? 'justify-start' : 'justify-end'}`}>
        <ThemeToggle />
        
        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            className="bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base px-3 sm:px-4"
            size={isMobile ? "sm" : "default"}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
