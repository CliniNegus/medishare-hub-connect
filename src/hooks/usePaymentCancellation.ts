
import React from 'react';
import { useToast } from "@/hooks/use-toast";

export const usePaymentCancellation = (loading: boolean, onError?: (error: string) => void) => {
  const { toast } = useToast();

  // Handle visibility change to detect when user returns from Paystack
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && loading) {
        // Check if there's payment info in URL
        const urlParams = new URLSearchParams(window.location.search);
        const reference = urlParams.get('reference');
        const status = urlParams.get('status');
        
        if (reference || status) {
          // There's payment info, let verification handle it
          return;
        }
        
        // User returned to the page while payment was in progress
        // Reset loading state after a short delay to allow for successful redirects
        setTimeout(() => {
          console.log('Payment process reset due to page visibility change - no payment info detected');
        }, 2000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loading]);

  // Handle page focus to detect when user returns
  React.useEffect(() => {
    const handleFocus = () => {
      if (loading) {
        // User returned to the page, check if there's a payment result in URL
        const urlParams = new URLSearchParams(window.location.search);
        const reference = urlParams.get('reference');
        const status = urlParams.get('status');
        
        if (reference || status) {
          // There's payment info in URL, let the verification process handle it
          return;
        }
        
        // No payment info in URL, likely a cancellation
        setTimeout(() => {
          toast({
            title: "Payment Cancelled",
            description: "Payment was not completed. You can try again.",
            variant: "destructive",
          });
          onError?.("Payment was cancelled by user");
          
          // Redirect to payment cancelled page
          setTimeout(() => {
            window.location.href = '/payment-cancelled';
          }, 1500);
        }, 1000);
      }
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [loading, toast, onError]);
};
