
import React, { useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw, CheckCircle } from "lucide-react";
import { useEmailVerification } from "@/hooks/useEmailVerification";

interface EmailVerificationAlertProps {
  email: string;
  fullName?: string;
  onVerificationSent?: () => void;
}

const EmailVerificationAlert: React.FC<EmailVerificationAlertProps> = ({ 
  email, 
  fullName,
  onVerificationSent 
}) => {
  const [emailSent, setEmailSent] = useState(false);
  const { resendVerificationEmail, loading } = useEmailVerification();

  const handleResendVerification = async () => {
    const result = await resendVerificationEmail(email, fullName);
    if (result.success) {
      setEmailSent(true);
      onVerificationSent?.();
    }
  };

  return (
    <div className="px-6 mb-4">
      <Alert className="border-orange-200 bg-orange-50">
        <Mail className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <div className="space-y-3">
            <div>
              <strong>Please verify your email address</strong>
              <p className="text-sm mt-1">
                We've sent a verification link to <strong>{email}</strong> from info@negusmed.com. 
                Click the link in your email to activate your account.
              </p>
            </div>
            
            <div className="text-sm text-orange-700">
              <p>📧 Check your <strong>spam/promotions folder</strong> if you don't see the email within a minute.</p>
              <p>✉️ The email is sent from <strong>NEGUS MED LIMITED (info@negusmed.com)</strong></p>
            </div>
            
            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResendVerification}
                disabled={loading || emailSent}
                className="text-orange-700 border-orange-300 hover:bg-orange-100"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    Sending...
                  </>
                ) : emailSent ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Email Sent
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Resend Email
                  </>
                )}
              </Button>
              
              {emailSent && (
                <span className="text-sm text-green-600 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verification email sent again!
                </span>
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default EmailVerificationAlert;
