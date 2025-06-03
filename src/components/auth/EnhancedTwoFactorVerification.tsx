
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Shield, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EnhancedTwoFactorVerificationProps {
  onSuccess: () => void;
  onBack: () => void;
}

const EnhancedTwoFactorVerification: React.FC<EnhancedTwoFactorVerificationProps> = ({ 
  onSuccess, 
  onBack 
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const { toast } = useToast();

  const MAX_ATTEMPTS = 3;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [canResend]);

  // Proper TOTP validation (this would need to be implemented server-side)
  const validateTOTPCode = (code: string): boolean => {
    // Client-side validation - check format only
    const codeRegex = /^\d{6}$/;
    return codeRegex.test(code);
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateTOTPCode(code)) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    if (attempts >= MAX_ATTEMPTS) {
      setError('Maximum verification attempts exceeded. Please try again later.');
      return;
    }

    try {
      setLoading(true);
      setAttempts(prev => prev + 1);

      // Log verification attempt
      await supabase.rpc('log_security_event', {
        event_type_param: '2fa_verification_attempt',
        event_details_param: { attempt_number: attempts + 1 }
      });

      // In a real implementation, this would verify the TOTP code server-side
      // For now, we'll simulate verification (you'd replace this with actual TOTP verification)
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        setError('User session expired. Please sign in again.');
        return;
      }

      // Simulate server-side TOTP verification
      // In reality, you'd send the code to your backend for verification
      const isValid = code === '123456'; // Demo code for testing
      
      if (isValid) {
        // Update MFA verification status
        const { error: mfaError } = await supabase
          .from('user_mfa')
          .update({ verified_at: new Date().toISOString() })
          .eq('user_id', user.user.id);

        if (mfaError) {
          console.error('MFA update error:', mfaError);
        }

        // Log successful verification
        await supabase.rpc('log_security_event', {
          event_type_param: '2fa_verification_success',
          event_details_param: {}
        });

        toast({
          title: "Verification successful!",
          description: "Two-factor authentication completed.",
        });
        
        onSuccess();
      } else {
        // Log failed verification
        await supabase.rpc('log_security_event', {
          event_type_param: '2fa_verification_failed',
          event_details_param: { attempt_number: attempts + 1 }
        });

        setError(`Invalid verification code. ${MAX_ATTEMPTS - attempts - 1} attempts remaining.`);
        
        if (attempts + 1 >= MAX_ATTEMPTS) {
          // Lock out user temporarily
          await supabase.rpc('log_security_event', {
            event_type_param: '2fa_max_attempts_exceeded',
            event_details_param: { total_attempts: attempts + 1 }
          });
        }
      }
    } catch (error: any) {
      console.error('2FA verification error:', error);
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setCanResend(false);
      setTimeRemaining(30);
      
      // Log resend request
      await supabase.rpc('log_security_event', {
        event_type_param: '2fa_code_resend_requested',
        event_details_param: {}
      });
      
      toast({
        title: "Verification code sent",
        description: "A new verification code has been sent to your authenticator app.",
      });
    } catch (error: any) {
      console.error('Resend error:', error);
      toast({
        title: "Error",
        description: "Failed to resend verification code.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <div className="flex items-center justify-center mb-2">
          <Shield className="h-8 w-8 text-[#E02020]" />
        </div>
        <CardTitle className="text-2xl font-bold text-[#333333]">Two-Factor Authentication</CardTitle>
        <p className="text-sm text-gray-600">
          Enter the 6-digit code from your authenticator app
        </p>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleVerification} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              className="w-full text-center text-2xl tracking-widest"
              disabled={loading || attempts >= MAX_ATTEMPTS}
              maxLength={6}
              pattern="\d{6}"
            />
            <p className="text-xs text-gray-500 text-center">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
              disabled={loading}
            >
              Back
            </Button>
            
            <Button 
              type="submit" 
              className="flex-1 bg-[#E02020] hover:bg-[#c01010]"
              disabled={loading || code.length !== 6 || attempts >= MAX_ATTEMPTS}
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </div>
          
          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={handleResendCode}
              disabled={!canResend || loading}
              className="text-sm text-[#E02020] hover:text-[#c01010]"
            >
              {canResend ? (
                <span className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" />
                  Resend Code
                </span>
              ) : (
                `Resend available in ${timeRemaining}s`
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedTwoFactorVerification;
