
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface EmailConfirmationAlertProps {
  email: string;
  onResendConfirmation: () => void;
  loading: boolean;
}

const EmailConfirmationAlert: React.FC<EmailConfirmationAlertProps> = ({ 
  email, 
  onResendConfirmation, 
  loading 
}) => {
  return (
    <Alert className="mx-6 mb-4 bg-red-50 border-red-500">
      <Info className="h-4 w-4 text-red-500" />
      <AlertTitle className="text-red-500">Email not confirmed</AlertTitle>
      <AlertDescription className="text-red-700">
        Please check your email and click the confirmation link to activate your account.
        <div className="mt-2">
          <Button 
            variant="outline" 
            onClick={onResendConfirmation} 
            disabled={loading}
            className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-700"
          >
            Resend confirmation email
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default EmailConfirmationAlert;
