import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import PasswordResetForm from '@/components/auth/PasswordResetForm';
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
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');

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

  const handleForgotPassword = () => {
    setShowPasswordReset(true);
    setActiveTab('passwordReset');
  };

  const handleResetSuccess = () => {
    setShowPasswordReset(false);
    setActiveTab('signin');
    toast({
      title: "Password Reset Email Sent",
      description: "Please check your email for further instructions.",
    });
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
    hospital: <Hospital className="h-8 w-8 mb-3 text-clinibuilds-red" />,
    manufacturer: <Factory className="h-8 w-8 mb-3 text-clinibuilds-red" />,
    investor: <PiggyBank className="h-8 w-8 mb-3 text-clinibuilds-red" />,
    admin: <ShieldAlert className="h-8 w-8 mb-3 text-clinibuilds-red" />
  };

  const roleDescriptions = {
    hospital: 'For healthcare facilities needing equipment',
    manufacturer: 'For equipment suppliers and manufacturers',
    investor: 'For financing medical equipment',
    admin: 'For platform administrators'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center pb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-clinibuilds-red to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Hospital className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-clinibuilds-dark">
                CliniBuilds Platform
              </CardTitle>
              <CardDescription className="text-gray-600">
                Medical Equipment Sharing & Management
              </CardDescription>
            </div>
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
          
          <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mx-6 mb-6 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="signin" 
                className="rounded-md font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-clinibuilds-red data-[state=active]:shadow-sm"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="rounded-md font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-clinibuilds-red data-[state=active]:shadow-sm"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <SignInForm 
                onSuccess={handleSignInSuccess}
                onEmailNotConfirmed={handleEmailNotConfirmed}
                onError={handleError}
                onForgotPassword={handleForgotPassword}
              />
            </TabsContent>
            
            <TabsContent value="signup">
              <div className="px-6 mb-6">
                <h3 className="text-lg font-semibold text-clinibuilds-dark mb-4">Select Account Type</h3>
                <div className="grid grid-cols-3 gap-3">
                  {['hospital', 'manufacturer', 'investor'].map((role) => (
                    <div 
                      key={role}
                      onClick={() => setSelectedRole(role as UserRole)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedRole === role 
                          ? 'bg-red-50 border-2 border-clinibuilds-red shadow-md transform scale-105' 
                          : 'bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      {roleIcons[role as UserRole]}
                      <span className="text-sm font-semibold text-clinibuilds-dark">
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-3 text-center">
                  {roleDescriptions[selectedRole]}
                </p>
              </div>
              
              <SignUpForm 
                onSuccess={handleSignUpSuccess}
                onError={handleError}
                metadata={{ role: selectedRole }}
              />
            </TabsContent>
            
            {showPasswordReset && (
              <TabsContent value="passwordReset">
                <PasswordResetForm 
                  onSuccess={handleResetSuccess}
                  onError={handleError}
                />
              </TabsContent>
            )}
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
