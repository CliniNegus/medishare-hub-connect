
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, Shield } from "lucide-react";

interface TwoFactorAuthenticationProps {
  onComplete?: () => void;
}

const TwoFactorAuthentication: React.FC<TwoFactorAuthenticationProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [otpValue, setOtpValue] = useState("");
  const [isEnabling, setIsEnabling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [setupData, setSetupData] = useState<{secret: string, qrCode: string} | null>(null);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const checkTwoFactorStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_mfa')
        .select('enabled')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (data) {
        setIs2FAEnabled(data.enabled);
      }
    } catch (error) {
      console.error('Error checking 2FA status:', error);
    }
  };

  React.useEffect(() => {
    if (user) {
      checkTwoFactorStatus();
    }
  }, [user]);

  const setupTwoFactor = async () => {
    if (!user) return;
    
    setIsEnabling(true);
    
    try {
      // In a real implementation, this would call a secure backend endpoint
      // to generate a secret and QR code for the user
      // For demo purposes, we're simulating this process
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockSecret = 'ABCDEFGHIJKLMNOP';
      const mockQrCode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAACA0lEQVR42uyYwa3DMAxD1RAeIKN4NI/gIXyXXlxHSZpDLwX6Awt5oixRJPl9/Ld+X+RrE8OFaEJxPRApaqSokUCQ4oYiJdCiRlGLJkx+DU0odyCS9xvl8sjJXy8M5e2ORPWkX0i1+w/mZTetlKLGUdTIFFdRoxY1MlFLqVE8NaGSN5Tm9iAn3xqaN5SixqO52VSPWneDU8CkbBJJSsm5kHNlRTXl/LJLUY0aR1HjKGqM1HJQC3JQPR2UQyFbQ7nSd69Rc6/NrbvvXjP3bk69tW9v15/3oNm+5eQ7tGxO3qG1c6+7eZeZewe/8eCG3pRo3jPNO6jZu6i5d9Hx4Db32tKbS/MeN+/C5l18PHLL3jEeOeadfjx4Zfe+8eA37/Xj0T8e/bP7hnkPMB49435/PHrOvZ7z4Dmb+5zJPD5oT7+bx4fN45PNu5p5V5vNy+NB/czke5lN3ifmMZ8UuKTAJQUuKXBJgUsKXP+mQF2A9gmmnoDmmbtnrp+5f+YRMg+ReZLMw2QeKHMzziNtHmpzM9abceYJMzflsZIyT9k8Z3Mzzq0583Sar+XZvqLm77D5ej5v+LOaIjVFakmRWkqRmh6p5UgtT9RCilpIUUspUitRraSoVaJWiVptolZT1FqK2ixq06JWa9RqiVorUWs1aa2G8FLdUFqLYestzr/qt3QB5o1OVmQeTZgAAAAASUVORK5CYII=';
      
      setSetupData({
        secret: mockSecret,
        qrCode: mockQrCode
      });
      
      // In a production app, we would save the secret to the database
      // associated with the user
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to set up 2FA",
        description: error.message || "An error occurred",
      });
    } finally {
      setIsEnabling(false);
    }
  };

  const verifyTwoFactor = async () => {
    if (!user || !setupData || otpValue.length !== 6) return;
    
    setIsVerifying(true);
    
    try {
      // Simulate verifying the OTP with the server
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, any 6-digit code will work
      // In a real app, this would verify against the actual TOTP algorithm
      
      // Save 2FA status to database
      const { error } = await supabase
        .from('user_mfa')
        .upsert({
          user_id: user.id,
          enabled: true,
          created_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      setIs2FAEnabled(true);
      setSetupData(null);
      
      toast({
        title: "Two-factor authentication enabled",
        description: "Your account is now more secure.",
      });
      
      if (onComplete) {
        onComplete();
      }
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: error.message || "Please check your code and try again",
      });
    } finally {
      setIsVerifying(false);
      setOtpValue("");
    }
  };

  const disableTwoFactor = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_mfa')
        .update({ enabled: false })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setIs2FAEnabled(false);
      
      toast({
        title: "Two-factor authentication disabled",
        description: "Your account security has been reduced.",
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error disabling 2FA",
        description: error.message || "An error occurred",
      });
    }
  };

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center text-red-600">
          <Shield className="h-5 w-5 mr-2" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account by requiring a verification code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {is2FAEnabled ? (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
              <h3 className="font-medium text-green-800 flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Two-factor authentication is enabled
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Your account has an extra layer of security. You'll need to enter a code from your authenticator app when you sign in.
              </p>
            </div>
          </div>
        ) : setupData ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="mb-2 text-sm text-gray-600">Scan this QR code with your authenticator app</p>
              <img src={setupData.qrCode} alt="QR Code" className="w-48 h-48 mb-4" />
              <p className="text-sm text-gray-600">Or enter this code manually: <span className="font-mono font-bold">{setupData.secret}</span></p>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Enter the 6-digit code from your authenticator app</p>
              <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Two-factor authentication adds an extra layer of security to your account. 
              When enabled, you'll need to enter a code from your authenticator app in addition to your password when signing in.
            </p>
            <div className="bg-red-50 p-4 rounded-md border border-red-200">
              <h3 className="font-medium text-red-800">Your account is not fully protected</h3>
              <p className="text-sm text-red-700 mt-1">
                Without two-factor authentication, your account is vulnerable to unauthorized access.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {is2FAEnabled ? (
          <Button 
            variant="outline" 
            onClick={disableTwoFactor}
            className="border-red-600 text-red-600 hover:bg-red-50"
          >
            Disable Two-Factor Authentication
          </Button>
        ) : setupData ? (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setSetupData(null)}
              disabled={isVerifying}
            >
              Cancel
            </Button>
            <Button 
              onClick={verifyTwoFactor}
              disabled={otpValue.length !== 6 || isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
          </div>
        ) : (
          <Button 
            onClick={setupTwoFactor}
            disabled={isEnabling}
          >
            {isEnabling ? "Setting up..." : "Enable Two-Factor Authentication"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TwoFactorAuthentication;
