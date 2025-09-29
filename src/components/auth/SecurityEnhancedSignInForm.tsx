
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Shield } from "lucide-react";

interface SecurityEnhancedSignInFormProps {
  onSuccess: () => void;
}

const SecurityEnhancedSignInForm: React.FC<SecurityEnhancedSignInFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const { toast } = useToast();

  // Client-side email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  // Client-side password validation
  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  // Input sanitization
  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Client-side validation
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);
    
    if (!validateEmail(sanitizedEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!validatePassword(sanitizedPassword)) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      setLoading(true);
      
      // Check rate limiting before attempting login
      const { data: rateLimitCheck } = await supabase.rpc('check_auth_rate_limit', {
        user_email: sanitizedEmail
      });
      
      if (!rateLimitCheck) {
        setRateLimited(true);
        setError('Too many failed login attempts. Please try again in 15 minutes.');
        
        // Log security event
        await supabase.rpc('log_security_event', {
          event_type_param: 'rate_limit_exceeded',
          event_details_param: { email: sanitizedEmail }
        });
        
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: sanitizedPassword,
      });

      if (signInError) {
        // Log failed login attempt
        await supabase.rpc('log_security_event', {
          event_type_param: 'login_failed',
          event_details_param: { 
            email: sanitizedEmail,
            error: signInError.message 
          }
        });
        
        // Generic error message for security
        setError('Invalid email or password. Please try again.');
        return;
      }

      if (data.user) {
        // Log successful login
        await supabase.rpc('log_security_event', {
          event_type_param: 'login_success',
          event_details_param: { email: sanitizedEmail }
        });
        
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        });
        
        onSuccess();
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <div className="flex items-center justify-center mb-2">
          <Shield className="h-8 w-8 text-[#E02020]" />
        </div>
        <CardTitle className="text-2xl font-bold text-[#333333]">Secure Sign In</CardTitle>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {rateLimited && (
          <Alert className="mb-4 border-orange-200 bg-orange-50">
            <AlertDescription className="text-orange-800">
              Account temporarily locked due to multiple failed attempts.
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full text-foreground"
              disabled={loading || rateLimited}
            />
          </div>
          
          <div className="space-y-2 relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full pr-10 text-foreground"
              disabled={loading || rateLimited}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={loading || rateLimited}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90"
            disabled={loading || rateLimited}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SecurityEnhancedSignInForm;
