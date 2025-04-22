
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TwoFactorVerificationProps {
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const TwoFactorVerification: React.FC<TwoFactorVerificationProps> = ({ 
  userId, 
  onSuccess, 
  onCancel 
}) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_mfa')
        .update({ verified_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('enabled', true)
        .select();

      if (error) throw error;
      
      toast({
        title: "Verification successful",
        description: "Two-factor authentication verified successfully",
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
              <path d="M21 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v1"></path>
              <path d="M21 16v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1"></path>
              <rect width="20" height="8" x="2" y="8" rx="2"></rect>
            </svg>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>
        </div>

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

export default TwoFactorVerification;
