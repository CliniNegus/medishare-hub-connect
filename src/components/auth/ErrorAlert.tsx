
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  return (
    <Alert className="mx-6 mb-4 bg-red-50 border-red-500">
      <Info className="h-4 w-4 text-red-500" />
      <AlertTitle className="text-red-500">Error</AlertTitle>
      <AlertDescription className="text-red-700">
        {message}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
