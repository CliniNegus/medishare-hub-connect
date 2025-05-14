
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { UserRole } from '@/contexts/UserRoleContext';
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SignUpFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
  metadata?: { role: UserRole };
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess, onError, metadata }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [passwordValidationMessage, setPasswordValidationMessage] = useState<string | null>(null);

  const validatePassword = async (password: string) => {
    try {
      setValidating(true);
      setPasswordValidationMessage(null);
      
      // Basic password strength checks
      if (password.length < 8) {
        setPasswordValidationMessage("Password must be at least 8 characters long");
        return false;
      }
      
      if (!/[A-Z]/.test(password)) {
        setPasswordValidationMessage("Password must contain at least one uppercase letter");
        return false;
      }
      
      if (!/[a-z]/.test(password)) {
        setPasswordValidationMessage("Password must contain at least one lowercase letter");
        return false;
      }
      
      if (!/[0-9]/.test(password)) {
        setPasswordValidationMessage("Password must contain at least one number");
        return false;
      }
      
      if (!/[^A-Za-z0-9]/.test(password)) {
        setPasswordValidationMessage("Password must contain at least one special character");
        return false;
      }
      
      // Check if password has been leaked using our edge function
      const { data, error } = await supabase.functions.invoke('validate-password', {
        body: { password }
      });

      if (error) {
        console.error("Error invoking validate-password function:", error);
        throw new Error("Could not validate password security: " + error.message);
      }
      
      if (data?.isCompromised) {
        setPasswordValidationMessage(`This password has been found in ${data.breachCount.toLocaleString()} data breaches. Please choose a different password.`);
        return false;
      }

      return true;
    } catch (error: any) {
      console.error("Password validation error:", error);
      setPasswordValidationMessage(error.message || "Error validating password");
      return false;
    } finally {
      setValidating(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate password against HaveIBeenPwned and basic strength requirements
      const isPasswordValid = await validatePassword(password);
      if (!isPasswordValid) {
        setLoading(false);
        return;
      }

      // Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            organization: organization,
            role: metadata?.role || 'hospital', // Default to hospital if not specified
          },
        },
      });

      if (signUpError) {
        console.error("Signup error:", signUpError);
        onError(signUpError.message);
        throw signUpError;
      }
      
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account.",
      });
      
      onSuccess();
    } catch (error: any) {
      console.error("Full signup error:", error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle password change to clear error message when user starts typing
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordValidationMessage) {
      setPasswordValidationMessage(null);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Input
            id="email-signup"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Input
            id="full-name"
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Input
            id="organization"
            type="text"
            placeholder="Organization (Hospital, Manufacturer, etc.)"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Input
            id="password-signup"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
            className={passwordValidationMessage ? "border-red-500" : ""}
          />
          {passwordValidationMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{passwordValidationMessage}</AlertDescription>
            </Alert>
          )}
          <p className="text-xs text-gray-500">
            Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full bg-red-600 hover:bg-red-700" 
          disabled={loading || validating}
        >
          {loading 
            ? "Creating account..." 
            : validating 
              ? "Validating password..." 
              : "Sign Up"
          }
        </Button>
      </CardFooter>
    </form>
  );
};

export default SignUpForm;
