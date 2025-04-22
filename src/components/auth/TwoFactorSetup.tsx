
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

interface TwoFactorSetupProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ 
  onSuccess, 
  onCancel 
}) => {
  const [setupKey, setSetupKey] = useState<string>("");
  const [qrCode, setQrCode] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      generateSetupKey();
    }
  }, [user]);

  const generateSetupKey = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // In a real implementation, this would be a call to an edge function
      // that generates a proper TOTP setup key and QR code
      const mockSetupKey = "ABCD EFGH IJKL MNOP";
      const mockQrCode = "https://via.placeholder.com/150?text=2FA+QR+Code";
      
      setSetupKey(mockSetupKey);
      setQrCode(mockQrCode);
      
      // Create MFA record
      await supabase
        .from('user_mfa')
        .upsert({ 
          user_id: user.id, 
          enabled: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
    } catch (error: any) {
      toast({
        title: "Setup error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!user || otp.length !== 6) return;
    
    setLoading(true);
    try {
      // In a real implementation, this would verify the OTP with the server
      // For this example, we'll just accept any 6-digit code
      
      const { error } = await supabase
        .from('user_mfa')
        .update({ 
          enabled: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been set up successfully",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CardContent className="space-y-6 pt-4">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="rounded-full bg-red-50 p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 h-6 w-6">
              <path d="M7 11v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1z"></path>
              <path d="M14 11v8a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1z"></path>
              <path d="M21 11v8a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1z"></path>
              <path d="M14 5v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2z"></path>
              <line x1="4" x2="4" y1="15" y2="15"></line>
              <line x1="12" x2="12" y1="15" y2="15"></line>
              <line x1="20" x2="20" y1="15" y2="15"></line>
            </svg>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Set Up Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500">
              Secure your account with an authenticator app
            </p>
          </div>
        </div>

        <Alert className="bg-red-50 border-red-100 text-red-800">
          <AlertDescription>
            <div className="text-sm">
              <p className="font-semibold mb-2">Scan this QR code with your authenticator app</p>
              <div className="flex justify-center my-4">
                <img src={qrCode} alt="QR Code" className="border border-gray-200 p-2 bg-white rounded-md" width="150" height="150" />
              </div>
              <p className="font-semibold mb-1">Or enter this setup key manually:</p>
              <div className="bg-white p-2 rounded border border-gray-200 font-mono text-center">
                {setupKey}
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <div>
          <p className="text-sm text-center mb-2">Enter the 6-digit code from your authenticator app</p>
          <div className="flex justify-center">
            <InputOTP 
              value={otp} 
              onChange={setOtp} 
              maxLength={6}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} index={index} className="bg-white border-gray-300" />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleVerify} 
          disabled={otp.length !== 6 || loading}
          className="bg-red-600 hover:bg-red-700"
        >
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </CardFooter>
    </>
  );
};

export default TwoFactorSetup;
