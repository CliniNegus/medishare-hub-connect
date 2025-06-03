import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showMfaVerification, setShowMfaVerification] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [showEmailVerificationAlert, setShowEmailVerificationAlert] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const { checkEmailVerified } = useEmailVerification();

  // Clear form fields when component mounts
  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // First check if email is verified
      const isEmailVerified = await checkEmailVerified(email);
      
      if (!isEmailVerified) {
        setUnverifiedEmail(email);
        setShowEmailVerificationAlert(true);
        toast({
          title: "Email verification required",
          description: "Please verify your email address before signing in.",
          variant: "destructive",
        });
        return;
      }

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

  if (showEmailVerificationAlert && unverifiedEmail) {
    return (
      <div className="space-y-4">
        <EmailVerificationAlert 
          email={unverifiedEmail}
          onVerificationSent={() => {
            toast({
              title: "Verification email sent",
              description: "Please check your email and click the verification link.",
            });
          }}
        />
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => {
              setShowEmailVerificationAlert(false);
              setUnverifiedEmail(null);
            }}
            className="w-full"
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (showMfaVerification) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); handleVerifyMfa(); }}>
        <CardContent className="space-y-6 pt-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-clinibuilds-red" />
            </div>
            <h3 className="text-xl font-semibold text-clinibuilds-dark">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>
          
          <div className="flex justify-center">
            <InputOTP 
              value={mfaCode} 
              onChange={setMfaCode} 
              maxLength={6}
              render={({ slots }) => (
                <InputOTPGroup className="gap-2">
                  {slots.map((slot, index) => (
                    <InputOTPSlot 
                      key={index} 
                      {...slot} 
                      index={index}
                      className="w-12 h-12 text-lg border-2 border-gray-200 focus:border-clinibuilds-red rounded-lg"
                    />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button 
              type="submit" 
              disabled={mfaCode.length !== 6 || loading}
              className="w-full h-12 bg-clinibuilds-red hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowMfaVerification(false)}
              disabled={loading}
              className="w-full h-12 border-2 border-gray-200 hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              Back to Login
            </Button>
          </div>
        </CardContent>
      </form>
    );
  }

  return (
    <form onSubmit={handleSignIn} className="space-y-6">
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-clinibuilds-dark">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 h-12 border-2 border-gray-200 focus:border-clinibuilds-red rounded-lg transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-clinibuilds-dark">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 pr-10 h-12 border-2 border-gray-200 focus:border-clinibuilds-red rounded-lg transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            <div className="text-right">
              <Button 
                variant="link" 
                type="button" 
                onClick={onForgotPassword}
                className="text-sm text-clinibuilds-red hover:text-red-700 p-0 h-auto font-medium transition-colors"
              >
                Forgot password?
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pb-6">
        <Button 
          type="submit" 
          className="w-full h-12 bg-clinibuilds-red hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl" 
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing in...</span>
            </div>
          ) : (
            "Sign In"
          )}
        </Button>
      </CardFooter>
    </form>
  );
};

export default SignInForm;
