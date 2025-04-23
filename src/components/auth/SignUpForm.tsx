import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { UserRole } from '@/contexts/UserRoleContext';

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

  const validatePassword = async (password: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('validate-password', {
        body: { password }
      })

      if (error) throw error
      if (data.isCompromised) {
        throw new Error('This password has been compromised in data breaches. Please choose a different password.')
      }

      return true
    } catch (error: any) {
      toast({
        title: "Password Validation Error",
        description: error.message,
        variant: "destructive"
      })
      return false
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate password against HaveIBeenPwned
      const isPasswordValid = await validatePassword(password)
      if (!isPasswordValid) {
        setLoading(false)
        return
      }

      // Sign up the user
      const { error: signUpError } = await supabase.auth.signUp({
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
        onError(signUpError.message);
        throw signUpError;
      }
      
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account.",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default SignUpForm;
