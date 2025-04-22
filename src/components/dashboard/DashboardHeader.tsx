
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
    <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} justify-between items-${isMobile ? 'start' : 'center'} mb-6`}>
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
      
      <div className={`flex items-center space-x-2 ${isMobile ? 'mt-4' : ''}`}>
        <ThemeToggle />
        
        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
