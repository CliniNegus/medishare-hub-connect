
import React from 'react';
import { cn } from '@/lib/utils';

type LoadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type LoadingType = 'spinner' | 'dots' | 'skeleton' | 'shimmer';
type LoadingColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

interface LoadingStateProps {
  active?: boolean;
  size?: LoadingSize;
  type?: LoadingType;
  color?: LoadingColor;
  text?: string;
  className?: string;
  fullPage?: boolean;
  overlay?: boolean;
  transparent?: boolean;
  children?: React.ReactNode;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  active = true,
  size = 'md',
  type = 'spinner',
  color = 'primary',
  text,
  className,
  fullPage = false,
  overlay = false,
  transparent = false,
  children,
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };
  
  const colorClasses = {
    default: 'text-gray-500 dark:text-gray-400',
    primary: 'text-red-600 dark:text-red-500',
    secondary: 'text-gray-600 dark:text-gray-300',
    success: 'text-green-600 dark:text-green-500',
    warning: 'text-yellow-600 dark:text-yellow-500',
    danger: 'text-red-600 dark:text-red-500',
  };
  
  const skeletonColors = {
    default: 'bg-gray-200 dark:bg-gray-700',
    primary: 'bg-red-200 dark:bg-red-800',
    secondary: 'bg-gray-200 dark:bg-gray-700',
    success: 'bg-green-200 dark:bg-green-800',
    warning: 'bg-yellow-200 dark:bg-yellow-800',
    danger: 'bg-red-200 dark:bg-red-800',
  };
  
  const renderLoadingIndicator = () => {
    switch (type) {
      case 'spinner':
        return (
          <div className={cn('animate-spin rounded-full border-4 border-t-transparent', sizeClasses[size], className)}>
            <span className="sr-only">Loading...</span>
          </div>
        );
        
      case 'dots':
        return (
          <div className="flex space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'rounded-full animate-pulse',
                  sizeClasses.xs,
                  colorClasses[color],
                  className
                )}
                style={{
                  animationDelay: `${i * 0.15}s`,
                  backgroundColor: 'currentColor',
                }}
              />
            ))}
          </div>
        );
        
      case 'skeleton':
        return (
          <div
            className={cn(
              'rounded animate-pulse',
              sizeClasses[size],
              skeletonColors[color],
              className
            )}
          />
        );
        
      case 'shimmer':
        return (
          <div
            className={cn(
              'rounded loading-shimmer',
              sizeClasses[size],
              skeletonColors[color],
              className
            )}
          />
        );
        
      default:
        return null;
    }
  };
  
  // If not active, render children directly
  if (!active) {
    return <>{children}</>;
  }
  
  // For full page loading
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-background dark:bg-background">
        <div className={cn('flex flex-col items-center', colorClasses[color])}>
          {renderLoadingIndicator()}
          {text && <p className="mt-4 text-sm font-medium">{text}</p>}
        </div>
      </div>
    );
  }
  
  // For overlay loading
  if (overlay) {
    return (
      <div className="relative">
        {children}
        <div className={cn(
          'absolute inset-0 flex items-center justify-center z-10',
          transparent ? 'bg-opacity-50 dark:bg-opacity-50' : 'bg-white/80 dark:bg-black/80',
          'backdrop-blur-sm'
        )}>
          <div className={cn('flex flex-col items-center', colorClasses[color])}>
            {renderLoadingIndicator()}
            {text && <p className="mt-2 text-sm font-medium">{text}</p>}
          </div>
        </div>
      </div>
    );
  }
  
  // Regular loading indicator
  return (
    <div className={cn('flex flex-col items-center', colorClasses[color])}>
      {renderLoadingIndicator()}
      {text && <p className="mt-2 text-sm font-medium">{text}</p>}
    </div>
  );
};

export default LoadingState;
