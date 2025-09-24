
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
import { Hospital, Factory, PiggyBank, ShieldAlert, Sparkles } from "lucide-react";
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

  // Check if user is already logged in - only on initial load, not after sign out
  useEffect(() => {
    const checkSession = async () => {
      // Check if we came from a sign out (check navigation state)
      const navigationState = window.history.state;
      const fromSignOut = navigationState?.usr?.fromSignOut;
      
      if (fromSignOut) {
        // Clear the navigation state and don't check session
        window.history.replaceState(null, '');
        return;
      }
      
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
    // TODO: Reinstate email verification enforcement later
    // TEMPORARY WORKAROUND: Redirect to dashboard immediately after sign-up
    // This bypasses email verification to avoid SMTP/email delivery issues
    toast({
      title: "Account created successfully! 🎉",
      description: "Please verify your email when convenient for full access.",
    });
    navigate('/dashboard');
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
    hospital: <Hospital className="h-6 w-6 text-[#E02020]" />,
    manufacturer: <Factory className="h-6 w-6 text-[#E02020]" />,
    investor: <PiggyBank className="h-6 w-6 text-[#E02020]" />,
    admin: <ShieldAlert className="h-6 w-6 text-[#E02020]" />
  };

  const roleDescriptions = {
    hospital: 'Healthcare facilities needing equipment',
    manufacturer: 'Equipment suppliers and manufacturers',
    investor: 'Financing medical equipment solutions',
    admin: 'Platform administrators'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#E02020]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-[#E02020]/5 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative w-full max-w-md z-10">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md overflow-hidden">
          {/* Header with logo and branding */}
          <CardHeader className="space-y-6 text-center pb-8 bg-gradient-to-br from-white to-gray-50/50">
            <div className="relative animate-fade-in">
              {/* Official Clinibuilds Logo */}
              <div className="mb-6 animate-scale-in">
                <img 
                  src="/lovable-uploads/661de53b-e7ab-4711-97b0-ac4cf9c089f0.png" 
                  alt="Clinibuilds Logo" 
                  className="h-12 md:h-16 w-auto mx-auto hover-scale transition-transform duration-300"
                />
              </div>
              
              {/* Tagline */}
              <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <CardTitle className="text-xl md:text-2xl font-bold text-[#333333]">
                  Welcome to Clinibuilds
                </CardTitle>
                <CardDescription className="text-sm md:text-base text-gray-600 font-medium">
                  Medical Equipment Sharing & Management Platform
                </CardDescription>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-2 -right-2 opacity-50 animate-pulse" style={{ animationDelay: '0.4s' }}>
                <Sparkles className="h-4 w-4 text-[#E02020]" />
              </div>
            </div>
          </CardHeader>
          
          {/* Alert messages */}
          {unconfirmedEmail && (
            <div className="px-6 pb-2">
              <EmailConfirmationAlert 
                email={unconfirmedEmail}
                onResendConfirmation={resendConfirmationEmail}
                loading={loading}
              />
            </div>
          )}

          {errorMessage && !unconfirmedEmail && (
            <div className="px-6 pb-2">
              <ErrorAlert message={errorMessage} />
            </div>
          )}
          
          {/* Modern tabs */}
          <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 pb-6">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100/80 p-1.5 rounded-2xl backdrop-blur-sm">
                <TabsTrigger 
                  value="signin" 
                  className="rounded-xl font-semibold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-[#E02020] data-[state=active]:shadow-md data-[state=active]:scale-105"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="rounded-xl font-semibold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-[#E02020] data-[state=active]:shadow-md data-[state=active]:scale-105"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="signin" className="mt-0">
              <SignInForm 
                onSuccess={handleSignInSuccess}
                onEmailNotConfirmed={handleEmailNotConfirmed}
                onError={handleError}
                onForgotPassword={handleForgotPassword}
              />
            </TabsContent>
            
            <TabsContent value="signup" className="mt-0">
              {/* Modern role selector */}
              <div className="px-6 mb-8">
                <h3 className="text-lg font-bold text-[#333333] mb-4 text-center">Choose Your Account Type</h3>
                <div className="grid grid-cols-3 gap-3">
                  {['hospital', 'manufacturer', 'investor'].map((role) => (
                    <div 
                      key={role}
                      onClick={() => setSelectedRole(role as UserRole)}
                      className={`relative group cursor-pointer transition-all duration-300 ${
                        selectedRole === role 
                          ? 'transform scale-105' 
                          : 'hover:scale-102'
                      }`}
                    >
                      <div className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                        selectedRole === role 
                          ? 'bg-gradient-to-br from-red-50 to-red-100/50 border-[#E02020] shadow-lg' 
                          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md'
                      }`}>
                        <div className={`mb-3 transition-all duration-300 ${
                          selectedRole === role ? 'transform scale-110' : ''
                        }`}>
                          {roleIcons[role as UserRole]}
                        </div>
                        <span className={`text-sm font-bold transition-all duration-300 ${
                          selectedRole === role ? 'text-[#E02020]' : 'text-[#333333]'
                        }`}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </span>
                        {selectedRole === role && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#E02020] rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center font-medium">
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
              <TabsContent value="passwordReset" className="mt-0">
                <PasswordResetForm 
                  onSuccess={handleResetSuccess}
                  onError={handleError}
                />
              </TabsContent>
            )}
          </Tabs>
        </Card>
        
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 CliniBuilds. Secure healthcare equipment management.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
