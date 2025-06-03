import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { UserRole } from '@/contexts/UserRoleContext';
import { AlertCircle, Mail, User, Building, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidationMessage, setPasswordValidationMessage] = useState<string | null>(null);
  const [emailPending, setEmailPending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingFullName, setPendingFullName] = useState<string | null>(null);

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

      // Sign up the user with email confirmation disabled initially
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
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

      if (data.user) {
        // Send custom verification email
        try {
          const { data: emailData, error: emailError } = await supabase.functions.invoke('send-verification-email', {
            body: {
              email,
              fullName,
              ipAddress: null,
              userAgent: navigator.userAgent,
            },
          });

          if (emailError || !emailData?.success) {
            console.error("Email send error:", emailError);
            // Don't fail the signup, but show a warning
            toast({
              title: "Account created",
              description: "Account created but verification email failed to send. Please contact support.",
              variant: "destructive",
            });
          } else {
            // Set pending verification state
            setEmailPending(true);
            setPendingEmail(email);
            setPendingFullName(fullName);
            
            toast({
              title: "Account created successfully!",
              description: "Please check your email to verify your account before signing in.",
            });
          }
        } catch (emailErr) {
          console.error("Email send error:", emailErr);
          toast({
            title: "Account created",
            description: "Account created but verification email failed to send. Please try resending from the login page.",
          });
        }
        
        onSuccess();
      }
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

  const passwordRequirements = [
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(password) },
    { text: "One lowercase letter", met: /[a-z]/.test(password) },
    { text: "One number", met: /[0-9]/.test(password) },
    { text: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <form onSubmit={handleSignUp} className="space-y-6">
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email-signup" className="text-sm font-medium text-clinibuilds-dark">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email-signup"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 h-12 border-2 border-gray-200 focus:border-clinibuilds-red rounded-lg transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="full-name" className="text-sm font-medium text-clinibuilds-dark">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="full-name"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="pl-10 h-12 border-2 border-gray-200 focus:border-clinibuilds-red rounded-lg transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="organization" className="text-sm font-medium text-clinibuilds-dark">
              Organization
            </Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="organization"
                type="text"
                placeholder="Hospital, Manufacturer, etc."
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                required
                className="pl-10 h-12 border-2 border-gray-200 focus:border-clinibuilds-red rounded-lg transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="password-signup" className="text-sm font-medium text-clinibuilds-dark">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="password-signup"
                type={showPassword ? "text" : "password"}
                placeholder="Create a secure password"
                value={password}
                onChange={handlePasswordChange}
                required
                className={`pl-10 pr-10 h-12 border-2 rounded-lg transition-all duration-200 ${
                  passwordValidationMessage ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-clinibuilds-red"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {password && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-clinibuilds-dark mb-2">Password Requirements:</p>
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className={`h-4 w-4 ${req.met ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className={`text-sm ${req.met ? 'text-green-600' : 'text-gray-500'}`}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            {passwordValidationMessage && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-700">
                  {passwordValidationMessage}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pb-6">
        <Button 
          type="submit" 
          className="w-full h-12 bg-clinibuilds-red hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl" 
          disabled={loading || validating}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating account...</span>
            </div>
          ) : validating ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Validating password...</span>
            </div>
          ) : (
            "Create Account"
          )}
        </Button>
      </CardFooter>
    </form>
  );
};

export default SignUpForm;
