
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EmailConfirmationAlertProps {
  email: string;
  onResendConfirmation?: () => void;
  onDismiss?: () => void;
  loading?: boolean;
  className?: string;
}

const EmailConfirmationAlert: React.FC<EmailConfirmationAlertProps> = ({ 
  email, 
  onResendConfirmation, 
  onDismiss,
  loading = false,
  className 
}) => {
  const [resending, setResending] = useState(false);
  
  const handleResend = async () => {
    if (onResendConfirmation) {
      onResendConfirmation();
      return;
    }
    
    // Default implementation if no custom handler is provided
    try {
      setResending(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error resending confirmation email:', error);
    } finally {
      setResending(false);
    }
  };
  
  return (
    <Alert className={`relative bg-red-50 border-red-500 ${className || ''}`}>
      <Info className="h-4 w-4 text-red-500" />
      <AlertTitle className="text-red-500">Email not confirmed</AlertTitle>
      <AlertDescription className="text-red-700">
        Please check your email and click the confirmation link to activate your account.
        <div className="mt-2">
          <Button 
            variant="outline" 
            onClick={handleResend} 
            disabled={loading || resending}
            className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-700"
          >
            {resending || loading ? "Sending..." : "Resend confirmation email"}
          </Button>
        </div>
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

export default EmailConfirmationAlert;
