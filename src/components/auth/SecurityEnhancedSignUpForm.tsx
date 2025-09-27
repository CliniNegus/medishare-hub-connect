
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Shield, Check, X } from "lucide-react";

interface SecurityEnhancedSignUpFormProps {
  onSuccess: () => void;
}

const SecurityEnhancedSignUpForm: React.FC<SecurityEnhancedSignUpFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Password strength validation
  const validatePasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score, isStrong: score >= 4 };
  };

  // Client-side email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  // Input sanitization
  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  };

  const passwordStrength = validatePasswordStrength(password);

  const PasswordStrengthIndicator = () => (
    <div className="mt-2 space-y-2">
      <div className="text-sm font-medium text-foreground">Password Requirements:</div>
      <div className="space-y-1 text-xs">
        {Object.entries({
          'At least 8 characters': passwordStrength.checks.length,
          'One uppercase letter': passwordStrength.checks.uppercase,
          'One lowercase letter': passwordStrength.checks.lowercase,
          'One number': passwordStrength.checks.number,
          'One special character': passwordStrength.checks.special
        }).map(([requirement, met]) => (
          <div key={requirement} className={`flex items-center gap-1 ${met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
            {met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            {requirement}
          </div>
        ))}
      </div>
    </div>
  );

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Client-side validation
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);
    const sanitizedFullName = sanitizeInput(fullName);
    
    if (!validateEmail(sanitizedEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!passwordStrength.isStrong) {
      setError('Please create a stronger password that meets all requirements');
      return;
    }
    
    if (sanitizedPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (sanitizedFullName.length < 2) {
      setError('Full name must be at least 2 characters long');
      return;
    }

    try {
      setLoading(true);
      
      // Server-side email validation
      const { data: emailValid } = await supabase.rpc('validate_email', {
        email_input: sanitizedEmail
      });
      
      if (!emailValid) {
        setError('Please enter a valid email address');
        return;
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: sanitizedPassword,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: sanitizedFullName,
            role: 'hospital' // Default role
          }
        }
      });

      if (signUpError) {
        // Log failed signup attempt
        await supabase.rpc('log_security_event', {
          event_type_param: 'signup_failed',
          event_details_param: { 
            email: sanitizedEmail,
            error: signUpError.message 
          }
        });
        
        if (signUpError.message.includes('already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else {
          setError('Failed to create account. Please try again.');
        }
        return;
      }

      if (data.user) {
        // Log successful signup
        await supabase.rpc('log_security_event', {
          event_type_param: 'signup_success',
          event_details_param: { email: sanitizedEmail }
        });
        
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account.",
        });
        
        onSuccess();
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <div className="flex items-center justify-center mb-2">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">Create Secure Account</CardTitle>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
              className="w-full"
              disabled={loading}
              maxLength={100}
            />
          </div>
          
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full"
              disabled={loading}
              maxLength={254}
            />
          </div>
          
          <div className="space-y-2 relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full pr-10"
              disabled={loading}
              maxLength={128}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          {password && <PasswordStrengthIndicator />}
          
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full"
              disabled={loading}
              maxLength={128}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90"
            disabled={loading || !passwordStrength.isStrong}
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SecurityEnhancedSignUpForm;
