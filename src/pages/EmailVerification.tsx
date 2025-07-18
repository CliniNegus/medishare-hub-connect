import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(3);

  // Add component mount logging
  console.log('EmailVerification component mounted');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      console.log('EmailVerification component loaded, token:', token);
      console.log('Current URL:', window.location.href);
      console.log('Search params:', Object.fromEntries(searchParams.entries()));
      
      if (!token) {
        console.error('No token found in URL');
        setStatus('error');
        setMessage('Invalid verification link. No token provided.');
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-email', {
          body: { token }
        });

        if (error) {
          throw error;
        }

        if (data?.success) {
          setStatus('success');
          setMessage('Your email has been verified successfully!');
          
          // Start countdown for redirect
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                navigate('/');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          return () => clearInterval(timer);
        } else {
          throw new Error(data?.message || 'Verification failed');
        }
      } catch (error: any) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage(error.message || 'The verification link is invalid or has expired.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-primary" />
              <h1 className="text-2xl font-semibold mb-2">Verifying Your Email</h1>
              <p className="text-muted-foreground">Please wait while we verify your email address...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-success" />
              <h1 className="text-2xl font-semibold mb-2 text-success">Email Verified!</h1>
              <p className="text-muted-foreground mb-4">{message}</p>
              <p className="text-sm text-muted-foreground mb-4">
                A welcome email has been sent to your inbox with helpful next steps.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Redirecting you to the homepage in {countdown} seconds...
              </p>
              <Button onClick={handleContinue} className="w-full">
                Continue to CliniBuilds
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
              <h1 className="text-2xl font-semibold mb-2 text-destructive">Verification Failed</h1>
              <p className="text-muted-foreground mb-4">{message}</p>
              <div className="space-y-2">
                <Button onClick={handleContinue} className="w-full">
                  Continue to CliniBuilds
                </Button>
                <Button variant="outline" onClick={() => navigate('/auth')} className="w-full">
                  Back to Sign In
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;