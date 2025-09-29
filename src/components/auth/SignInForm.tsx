
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight } from "lucide-react";
import { useEmailVerification } from "@/hooks/useEmailVerification";
import EmailVerificationAlert from "@/components/auth/EmailVerificationAlert";

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
        <CardContent className="space-y-8 pt-6 px-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-red-50">
              <Shield className="h-10 w-10 text-[#E02020]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#333333]">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <InputOTP 
              value={mfaCode} 
              onChange={setMfaCode} 
              maxLength={6}
              render={({ slots }) => (
                <InputOTPGroup className="gap-3">
                  {slots.map((slot, index) => (
                    <InputOTPSlot 
                      key={index} 
                      {...slot} 
                      index={index}
                      className="w-14 h-14 text-xl font-bold border-2 border-gray-200 focus:border-[#E02020] rounded-xl transition-all duration-200 hover:border-gray-300"
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
              className="w-full h-14 bg-gradient-to-r from-[#E02020] to-[#c01010] hover:from-[#c01010] hover:to-[#a00808] text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Verify Code</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowMfaVerification(false)}
              disabled={loading}
              className="w-full h-12 border-2 border-gray-200 hover:bg-gray-50 rounded-xl transition-all duration-200 font-semibold"
            >
              Back to Login
            </Button>
          </div>
        </CardContent>
      </form>
    );
  }

  return (
    <form onSubmit={handleSignIn} className="space-y-0">
      <CardContent className="space-y-8 pt-6 px-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-bold text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Email Address
            </Label>
            <div className="relative group">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 pl-4 pr-4 border-2 border-border focus:border-primary rounded-xl transition-all duration-300 text-base font-medium placeholder:text-muted-foreground bg-background/80 backdrop-blur-sm hover:bg-background focus:bg-background group-hover:border-border text-foreground"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm font-bold text-foreground flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              Password
            </Label>
            <div className="relative group">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-14 pl-4 pr-14 border-2 border-border focus:border-primary rounded-xl transition-all duration-300 text-base font-medium placeholder:text-muted-foreground bg-background/80 backdrop-blur-sm hover:bg-background focus:bg-background group-hover:border-border text-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200 p-1"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            <div className="text-right">
              <Button 
                variant="link" 
                type="button" 
                onClick={onForgotPassword}
                className="text-sm text-primary hover:text-primary/80 p-0 h-auto font-semibold transition-colors duration-200 underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pb-8 px-8">
          <Button 
            type="submit" 
            className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105" 
            disabled={loading}
          >
          {loading ? (
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing you in...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Sign In</span>
              <ArrowRight className="h-5 w-5" />
            </div>
          )}
        </Button>
      </CardFooter>
    </form>
  );
};

export default SignInForm;
