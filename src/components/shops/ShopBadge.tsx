
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

const ShopBadge = ({ children, className, ...props }: BadgeProps) => {
  return (
    <span 
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`} 
      {...props}
    >
      {children}
    </span>
  );
};

export default ShopBadge;
