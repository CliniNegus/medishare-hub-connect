
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X, Info } from "lucide-react";

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onDismiss, className }) => {
  return (
    <Alert className={`bg-red-50 border-red-500 relative ${className || ''}`}>
      <Info className="h-4 w-4 text-red-500" />
      <AlertTitle className="text-red-500">Error</AlertTitle>
      <AlertDescription className="text-red-700">
        {message}
      </AlertDescription>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </Alert>
  );
};

export default ErrorAlert;
