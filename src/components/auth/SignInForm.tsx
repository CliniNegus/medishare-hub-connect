
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Link } from 'react-router-dom';
import { Eye, EyeOff, MailCheck } from "lucide-react";
import { ButtonLoader } from '@/components/ui/loader';

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

  // Clear form fields when component mounts
  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
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
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      onSuccess();
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

  return (
    <form onSubmit={handleSignIn} className="animate-fade-in">
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-gray-300"
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Button 
              variant="link" 
              type="button" 
              onClick={onForgotPassword}
              className="text-xs text-red-600 p-0 h-auto font-normal"
            >
              Forgot password?
            </Button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-gray-300 pr-10"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
              onClick={toggleShowPassword}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button 
          type="submit" 
          className="w-full bg-red-600 hover:bg-red-700" 
          disabled={loading}
        >
          {loading ? (
            <>
              <ButtonLoader /> Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground pt-2">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardFooter>
    </form>
  );
};

export default SignInForm;
