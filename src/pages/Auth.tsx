
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEmailNotConfirmed, setIsEmailNotConfirmed] = useState(false);

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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsEmailNotConfirmed(false);
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setIsEmailNotConfirmed(true);
        } else {
          setErrorMessage(error.message);
        }
        throw error;
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      if (!isEmailNotConfirmed) {
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    try {
      setLoading(true);
      
      // Sign up the user
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            organization: organization,
          },
        },
      });

      if (signUpError) {
        setErrorMessage(signUpError.message);
        throw signUpError;
      }
      
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account.",
      });
    } catch (error: any) {
      if (!isEmailNotConfirmed) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmationEmail = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
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
        
        {isEmailNotConfirmed && (
          <Alert className="mx-6 mb-4 bg-red-50 border-red-500">
            <Info className="h-4 w-4 text-red-500" />
            <AlertTitle className="text-red-500">Email not confirmed</AlertTitle>
            <AlertDescription className="text-red-700">
              Please check your email and click the confirmation link to activate your account.
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  onClick={resendConfirmationEmail} 
                  disabled={loading}
                  className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-700"
                >
                  Resend confirmation email
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {errorMessage && !isEmailNotConfirmed && (
          <Alert className="mx-6 mb-4 bg-red-50 border-red-500">
            <Info className="h-4 w-4 text-red-500" />
            <AlertTitle className="text-red-500">Error</AlertTitle>
            <AlertDescription className="text-red-700">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="password"
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
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
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
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
