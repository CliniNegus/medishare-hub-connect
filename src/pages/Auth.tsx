
import React, { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import EmailConfirmationAlert from '@/components/auth/EmailConfirmationAlert';
import ErrorAlert from '@/components/auth/ErrorAlert';
import PasswordResetForm from '@/components/auth/PasswordResetForm';
import { useUserRole, UserRole } from '@/contexts/UserRoleContext';
import { Hospital, Factory, PiggyBank } from 'lucide-react';
import { motion } from 'framer-motion';

const Auth = () => {
  const { user, loading } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  
  const [activeTab, setActiveTab] = useState<string>("sign-in");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailForConfirmation, setEmailForConfirmation] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // If user is already authenticated, redirect to dashboard
  if (user && !loading) {
    return <Navigate to={from} />;
  }

  const handleSignInSuccess = () => {
    navigate(from);
  };

  const handleSignUpSuccess = () => {
    setActiveTab("sign-in");
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
  };

  const handleEmailNotConfirmed = (email: string) => {
    setEmailForConfirmation(email);
  };

  const handleDismissError = () => {
    setErrorMessage(null);
  };

  const handleDismissEmailConfirmation = () => {
    setEmailForConfirmation(null);
  };

  const handleShowForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToSignIn = () => {
    setShowForgotPassword(false);
  };

  const getRoleIconByName = (roleName: UserRole) => {
    switch (roleName) {
      case 'hospital':
        return <Hospital className="h-5 w-5 text-blue-500" />;
      case 'manufacturer':
        return <Factory className="h-5 w-5 text-green-500" />;
      case 'investor':
        return <PiggyBank className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center mb-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-r from-red-600 to-black mr-2"></div>
          <h1 className="text-2xl font-bold">CliniBuilds</h1>
        </div>
        <p className="text-gray-600">Medical Equipment Sharing Platform</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
        {errorMessage && (
          <ErrorAlert message={errorMessage} onDismiss={handleDismissError} className="mb-4" />
        )}

        {emailForConfirmation && (
          <EmailConfirmationAlert 
            email={emailForConfirmation} 
            onDismiss={handleDismissEmailConfirmation} 
            className="mb-4" 
          />
        )}

        <Card className="shadow-lg border-gray-200">
          <CardHeader className="pb-4 pt-6 text-center bg-white rounded-t-lg">
            {showForgotPassword ? (
              <>
                <CardTitle className="text-xl">Reset Your Password</CardTitle>
                <CardDescription>
                  Enter your email and we'll send you a link to reset your password
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-xl">
                  {activeTab === "sign-in" ? "Welcome Back" : "Create an Account"}
                </CardTitle>
                <CardDescription>
                  {activeTab === "sign-in" 
                    ? "Sign in to access your account" 
                    : "Sign up to get started with CliniBuilds"}
                </CardDescription>
              </>
            )}
          </CardHeader>
          
          {!showForgotPassword ? (
            <Tabs defaultValue="sign-in" value={activeTab} onValueChange={setActiveTab}>
              <div className="px-6">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="sign-in" className="rounded-l-md">Sign In</TabsTrigger>
                  <TabsTrigger value="sign-up" className="rounded-r-md">Sign Up</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="sign-in">
                <SignInForm
                  onSuccess={handleSignInSuccess}
                  onError={handleError}
                  onEmailNotConfirmed={handleEmailNotConfirmed}
                  onForgotPassword={handleShowForgotPassword}
                />
              </TabsContent>
              <TabsContent value="sign-up">
                <SignUpForm
                  onSuccess={handleSignUpSuccess}
                  onError={handleError}
                  metadata={{ role }}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <PasswordResetForm onBackToSignIn={handleBackToSignIn} />
          )}
          
          {role && !showForgotPassword && (
            <div className="p-4 border-t text-sm text-center">
              <div className="flex items-center justify-center text-gray-600">
                <span>Signing up as:</span>
                <span className="flex items-center ml-2 font-medium">
                  {getRoleIconByName(role)}
                  <span className="ml-1 capitalize">{role}</span>
                </span>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
