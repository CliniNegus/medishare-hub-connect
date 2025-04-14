
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
import { Hospital, Factory, PiggyBank, ShieldAlert } from "lucide-react";
import { UserRole } from '@/contexts/UserRoleContext';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('hospital');

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

  const roleIcons = {
    hospital: <Hospital className="h-8 w-8 mb-2 text-red-600" />,
    manufacturer: <Factory className="h-8 w-8 mb-2 text-red-600" />,
    investor: <PiggyBank className="h-8 w-8 mb-2 text-red-600" />,
    admin: <ShieldAlert className="h-8 w-8 mb-2 text-red-600" />
  };

  const roleDescriptions = {
    hospital: 'For healthcare facilities needing equipment',
    manufacturer: 'For equipment suppliers and manufacturers',
    investor: 'For financing medical equipment',
    admin: 'For platform administrators'
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
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Select Account Type</h3>
              <div className="grid grid-cols-3 gap-2">
                {['hospital', 'manufacturer', 'investor'].map((role) => (
                  <div 
                    key={role}
                    onClick={() => setSelectedRole(role as UserRole)}
                    className={`flex flex-col items-center justify-center p-2 rounded-md cursor-pointer ${
                      selectedRole === role 
                        ? 'bg-red-50 border-2 border-red-600' 
                        : 'bg-white border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {roleIcons[role as UserRole]}
                    <span className="text-sm font-medium">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {roleDescriptions[selectedRole]}
              </p>
            </div>
            
            <SignUpForm 
              onSuccess={handleSignUpSuccess}
              onError={handleError}
              metadata={{ role: selectedRole }}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
