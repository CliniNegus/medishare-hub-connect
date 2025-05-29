
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Mail, ArrowLeft } from "lucide-react";

interface PasswordResetFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onSuccess, onError }) => {
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
        onError(error.message);
        throw error;
      }
      
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for instructions to reset your password.",
      });
      
      onSuccess();
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
    <form onSubmit={handlePasswordReset} className="space-y-6">
      <CardHeader className="text-center space-y-2 pb-2">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-xl font-semibold text-clinibuilds-dark">Reset Password</CardTitle>
        <CardDescription className="text-gray-600">
          Enter your email to receive a password reset link
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-2">
        <div className="space-y-2">
          <Label htmlFor="email-reset" className="text-sm font-medium text-clinibuilds-dark">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="email-reset"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 h-12 border-2 border-gray-200 focus:border-clinibuilds-red rounded-lg transition-all duration-200"
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-3 pb-6">
        <Button 
          type="submit" 
          className="w-full h-12 bg-clinibuilds-red hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl" 
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending...</span>
            </div>
          ) : (
            "Send Reset Link"
          )}
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => window.history.back()}
          className="w-full h-12 border-2 border-gray-200 hover:bg-gray-50 rounded-lg transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </Button>
      </CardFooter>
    </form>
  );
};

export default PasswordResetForm;
