
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Link } from 'react-router-dom';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface SignInFormProps {
  onSuccess: () => void;
  onEmailNotConfirmed: (email: string) => void;
  onError: (message: string) => void;
  onForgotPassword: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ 
  onSuccess, 
  onEmailNotConfirmed, 
  onError,
  onForgotPassword 
}) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMfaVerification, setShowMfaVerification] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  // Clear form fields when component mounts
  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          onEmailNotConfirmed(email);
        } else {
          onError(error.message);
        }
        throw error;
      }
      
      if (!data.user) {
        throw new Error('No user returned from authentication');
      }
      
      // Check if 2FA is enabled for this user
      const { data: mfaData, error: mfaError } = await supabase
        .from('user_mfa')
        .select('enabled')
        .eq('user_id', data.user.id)
        .single();
      
      if (mfaError && mfaError.code !== 'PGRST116') {
        throw mfaError;
      }
      
      if (mfaData?.enabled) {
        // Show 2FA verification
        setUserId(data.user.id);
        setShowMfaVerification(true);
        
        // Sign out until 2FA is verified
        await supabase.auth.signOut();
      } else {
        // No 2FA, proceed with login
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        onSuccess();
      }
    } catch (error: any) {
      if (!error.message.includes('Email not confirmed')) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMfa = async () => {
    if (!userId || mfaCode.length !== 6) return;
    
    try {
      setLoading(true);
      
      // This is a simplified implementation for demo purposes
      // In a real app, you would validate the MFA code against a TOTP algorithm
      // For this example, we'll accept any 6-digit code
      
      // After verification, sign the user back in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
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

  if (showMfaVerification) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); handleVerifyMfa(); }}>
        <CardContent className="space-y-4 pt-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>
          
          <div className="flex justify-center mb-4">
            <InputOTP 
              value={mfaCode} 
              onChange={setMfaCode} 
              maxLength={6}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} index={index} />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowMfaVerification(false)}
              disabled={loading}
            >
              Back to Login
            </Button>
            <Button 
              type="submit" 
              disabled={mfaCode.length !== 6 || loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </CardContent>
      </form>
    );
  }

  return (
    <form onSubmit={handleSignIn}>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="text-right">
            <Button 
              variant="link" 
              type="button" 
              onClick={onForgotPassword}
              className="text-xs text-red-600 p-0 h-auto font-normal"
            >
              Forgot password?
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default SignInForm;
