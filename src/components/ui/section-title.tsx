
import React from 'react';
import { cn } from "@/lib/utils";

interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  subtitle?: string;
}

export function SectionTitle({ 
  children, 
  subtitle, 
  className,
  ...props 
}: SectionTitleProps) {
  return (
    <div className="mb-6">
      <h2 
        className={cn("text-2xl font-bold text-[#333333] dark:text-white", className)} 
        {...props}
      >
        {children}
      </h2>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function PageTitle({ 
  children, 
  subtitle, 
  className,
  ...props 
}: SectionTitleProps) {
  return (
    <div className="mb-8">
      <h1 
        className={cn("text-3xl font-bold text-[#333333] dark:text-white", className)} 
        {...props}
      >
        {children}
      </h1>
      {subtitle && (
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {subtitle}
        </p>
      )}
    </div>
  );
}
