import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { UserRole } from '@/contexts/UserRoleContext';
import { AlertCircle, Mail, User, Building, Lock, Eye, EyeOff, CheckCircle, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useEmailVerification } from '@/hooks/useEmailVerification';
import { useGoogleOAuth } from '@/hooks/useGoogleOAuth';
import GoogleIcon from "@/components/icons/GoogleIcon";

interface SignUpFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
  metadata?: { role: UserRole };
  hasSelectedRole?: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess, onError, metadata, hasSelectedRole = false }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { sendVerificationEmail } = useEmailVerification();
  const { isLoading: googleLoading, loadingMessage, initiateGoogleOAuth } = useGoogleOAuth();
  
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidationMessage, setPasswordValidationMessage] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);

  const handleGoogleSignUp = async () => {
    if (!hasSelectedRole) {
      onError('Please select your account type above before continuing with Google.');
      return;
    }
    const role = metadata?.role || 'hospital';
    await initiateGoogleOAuth({ role, mode: 'signup' });
  };

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
    setTermsError(null);

    // Check if terms are accepted
    if (!acceptedTerms) {
      setTermsError("You must accept the Terms of Service and Privacy Policy to continue.");
      setLoading(false);
      return;
    }

    try {
      // Validate password against HaveIBeenPwned and basic strength requirements
      const isPasswordValid = await validatePassword(password);
      if (!isPasswordValid) {
        setLoading(false);
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined,
          data: {
            full_name: fullName,
            organization: organization,
            role: metadata?.role || 'hospital',
            email_confirm: false
          }
        },
      });

      if (signUpError) {
        console.error("Signup error:", signUpError);
        
        if (signUpError.message.includes('already registered') || signUpError.message.includes('already exists')) {
          onError('An account with this email already exists. Please sign in instead.');
        } else {
          onError(signUpError.message);
        }
        return;
      }

      if (data?.user) {
        console.log("User created successfully, proceeding with immediate access...");
        
        // Send verification email in background but don't block user access
        try {
          const emailResult = await sendVerificationEmail(email, fullName);
          
          if (emailResult.success) {
            console.log("Verification email sent successfully in background");
          } else {
            console.error("Background email verification failed:", emailResult.error);
          }
        } catch (emailErr: any) {
          console.error("Background email send error:", emailErr);
        }
        
        // Redirect based on role - manufacturers go to specialized onboarding
        const selectedRole = metadata?.role || 'hospital';
        if (selectedRole === 'manufacturer') {
          navigate('/manufacturer/onboarding');
        } else {
          navigate('/complete-profile');
        }
      } else {
        throw new Error("User creation failed - no user data returned");
      }
    } catch (error: any) {
      console.error("Full signup error:", error);
      onError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordValidationMessage) {
      setPasswordValidationMessage(null);
    }
  };

  const handleTermsChange = (checked: boolean) => {
    setAcceptedTerms(checked);
    if (termsError && checked) {
      setTermsError(null);
    }
  };

  const passwordRequirements = [
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(password) },
    { text: "One lowercase letter", met: /[a-z]/.test(password) },
    { text: "One number", met: /[0-9]/.test(password) },
    { text: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const roleLabel = metadata?.role ? metadata.role.charAt(0).toUpperCase() + metadata.role.slice(1) : null;
  const isAnyLoading = loading || googleLoading;

  return (
    <form onSubmit={handleSignUp} className="space-y-0">
      <CardContent className="space-y-6 pt-6 px-8">
        {/* Google Sign Up Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignUp}
          disabled={isAnyLoading}
          className={`w-full h-14 border-2 rounded-xl font-semibold transition-all duration-300 ${
            hasSelectedRole 
              ? 'hover:bg-muted/50 hover:border-primary' 
              : 'opacity-70 border-dashed'
          }`}
        >
          {googleLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              {loadingMessage || 'Redirecting to Google...'}
            </>
          ) : (
            <>
              <GoogleIcon className="w-5 h-5 mr-3" />
              {hasSelectedRole 
                ? `Continue with Google as ${roleLabel}` 
                : 'Select a role above first'}
            </>
          )}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-4 text-muted-foreground font-medium">
              or continue with email
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <Label htmlFor="email-signup" className="text-sm font-bold text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Email Address
            </Label>
            <div className="relative group">
              <Input
                id="email-signup"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isAnyLoading}
                className="h-14 pl-4 pr-4 border-2 border-border focus:border-primary rounded-xl transition-all duration-300 text-base font-medium placeholder:text-muted-foreground bg-background/80 backdrop-blur-sm hover:bg-background focus:bg-background group-hover:border-border"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="full-name" className="text-sm font-bold text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Full Name
            </Label>
            <div className="relative group">
              <Input
                id="full-name"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isAnyLoading}
                className="h-14 pl-4 pr-4 border-2 border-border focus:border-primary rounded-xl transition-all duration-300 text-base font-medium placeholder:text-muted-foreground bg-background/80 backdrop-blur-sm hover:bg-background focus:bg-background group-hover:border-border"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="organization" className="text-sm font-bold text-foreground flex items-center gap-2">
              <Building className="h-4 w-4 text-primary" />
              Organization
            </Label>
            <div className="relative group">
              <Input
                id="organization"
                type="text"
                placeholder="Your hospital, clinic, or organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                required
                disabled={isAnyLoading}
                className="h-14 pl-4 pr-4 border-2 border-border focus:border-primary rounded-xl transition-all duration-300 text-base font-medium placeholder:text-muted-foreground bg-background/80 backdrop-blur-sm hover:bg-background focus:bg-background group-hover:border-border"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="password-signup" className="text-sm font-bold text-foreground flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              Create Password
            </Label>
            <div className="relative group">
              <Input
                id="password-signup"
                type={showPassword ? "text" : "password"}
                placeholder="Create a secure password"
                value={password}
                onChange={handlePasswordChange}
                required
                disabled={isAnyLoading}
                className={`h-14 pl-4 pr-14 border-2 rounded-xl transition-all duration-300 text-base font-medium placeholder:text-muted-foreground bg-background/80 backdrop-blur-sm hover:bg-background focus:bg-background ${
                  passwordValidationMessage ? "border-destructive focus:border-destructive" : "border-border focus:border-primary group-hover:border-border"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200 p-1"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {password && (
              <div className="bg-gradient-to-br from-muted/30 to-background rounded-2xl p-6 border border-border shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-sm font-bold text-foreground">Password Requirements:</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                        req.met ? 'bg-green-500/20 text-green-600 dark:bg-green-500/30 dark:text-green-400' : 'bg-muted text-muted-foreground'
                      }`}>
                        <CheckCircle className="h-3 w-3" />
                      </div>
                      <span className={`text-sm font-medium transition-all duration-300 ${
                        req.met ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'
                      }`}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {passwordValidationMessage && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  {passwordValidationMessage}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Terms and Privacy Policy Checkbox */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="terms-checkbox"
                checked={acceptedTerms}
                onCheckedChange={handleTermsChange}
                className="mt-1"
                aria-describedby="terms-error"
                disabled={isAnyLoading}
              />
              <Label 
                htmlFor="terms-checkbox" 
                className="text-sm font-medium text-foreground leading-relaxed cursor-pointer"
              >
                I agree to the{' '}
                <a 
                  href="/terms-of-service" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline font-semibold transition-colors duration-200"
                >
                  Terms of Service
                </a>
                {' '}and{' '}
                <a 
                  href="/privacy-policy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline font-semibold transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                .
              </Label>
            </div>
            
            {termsError && (
              <Alert variant="destructive" className="rounded-xl" id="terms-error">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  {termsError}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pb-8 px-8">
        <Button 
          type="submit" 
          className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105" 
          disabled={isAnyLoading || validating}
        >
          {loading || validating ? (
            <div className="flex items-center space-x-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{validating ? 'Validating...' : 'Creating account...'}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Create Account</span>
              <ArrowRight className="h-5 w-5" />
            </div>
          )}
        </Button>
      </CardFooter>
    </form>
  );
};

export default SignUpForm;
