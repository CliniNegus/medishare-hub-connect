import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveChartProps {
  children: React.ReactNode;
  height?: number;
  mobileHeight?: number;
  className?: string;
}

const ResponsiveChart: React.FC<ResponsiveChartProps> = ({
  children,
  height = 400,
  mobileHeight = 300,
  className = ""
}) => {
  const isMobile = useIsMobile();
  const chartHeight = isMobile ? mobileHeight : height;

  return (
    <div 
      className={`chart-responsive ${className}`}
      style={{ height: chartHeight }}
    >
      <div className="w-full h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default ResponsiveChart;