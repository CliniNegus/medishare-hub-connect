
import React, { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
  mobileFullWidth?: boolean;
  maxWidth?: string;
  padding?: string;
  center?: boolean;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  mobileClassName,
  desktopClassName,
  mobileFullWidth = true,
  maxWidth = "1200px",
  padding = "px-4 sm:px-6 md:px-8",
  center = true,
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={cn(
        padding,
        center && "mx-auto",
        !isMobile && `max-w-[${maxWidth}]`,
        isMobile && mobileFullWidth && "w-full",
        className,
        isMobile ? mobileClassName : desktopClassName
      )}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;
