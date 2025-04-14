
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import EmailConfirmationAlert from '@/components/auth/EmailConfirmationAlert';
import ErrorAlert from '@/components/auth/ErrorAlert';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/dashboard');
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleSignInSuccess = () => {
    navigate('/dashboard');
  };

  const handleSignUpSuccess = () => {
    // Reset the form state, user should get confirmation message
    setUnconfirmedEmail(null);
    setErrorMessage(null);
  };

  const handleEmailNotConfirmed = (email: string) => {
    setUnconfirmedEmail(email);
    setErrorMessage(null);
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    setUnconfirmedEmail(null);
  };

  const resendConfirmationEmail = async () => {
    if (!unconfirmedEmail) return;
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: unconfirmedEmail,
      });

      if (error) {
        setErrorMessage(error.message);
        throw error;
      }

      toast({
        title: "Confirmation email sent",
        description: "Please check your inbox for the confirmation link.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to resend confirmation email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Medical Equipment Sharing</CardTitle>
          <CardDescription>
            Sign in to access the platform
          </CardDescription>
        </CardHeader>
        
        {unconfirmedEmail && (
          <EmailConfirmationAlert 
            email={unconfirmedEmail}
            onResendConfirmation={resendConfirmationEmail}
            loading={loading}
          />
        )}

        {errorMessage && !unconfirmedEmail && (
          <ErrorAlert message={errorMessage} />
        )}
        
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <SignInForm 
              onSuccess={handleSignInSuccess}
              onEmailNotConfirmed={handleEmailNotConfirmed}
              onError={handleError}
            />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignUpForm 
              onSuccess={handleSignUpSuccess}
              onError={handleError}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
