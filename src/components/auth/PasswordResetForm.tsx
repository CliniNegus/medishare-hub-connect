
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ButtonLoader } from "@/components/ui/loader";

interface PasswordResetFormProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
  onBackToSignIn?: () => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ 
  onSuccess, 
  onError,
  onBackToSignIn
}) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) {
        if (onError) onError(error.message);
        throw error;
      }
      
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for instructions to reset your password.",
      });
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        title: "Password Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePasswordReset}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            id="email-reset"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
          {loading ? <><ButtonLoader /> Sending...</> : "Send Reset Link"}
        </Button>
        {onBackToSignIn && (
          <Button 
            type="button" 
            variant="ghost" 
            className="text-sm text-gray-600 hover:text-gray-900" 
            onClick={onBackToSignIn}
          >
            Back to Sign In
          </Button>
        )}
      </CardFooter>
    </form>
  );
};

export default PasswordResetForm;
