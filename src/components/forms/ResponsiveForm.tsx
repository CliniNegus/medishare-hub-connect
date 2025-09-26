import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveFormProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveForm: React.FC<ResponsiveFormProps> = ({
  children,
  className = ""
}) => {
  const isMobile = useIsMobile();

  return (
    <form className={`form-mobile space-y-4 ${className}`}>
      <div className={isMobile ? 'space-y-4' : 'space-y-6'}>
        {children}
      </div>
    </form>
  );
};

export default ResponsiveForm;