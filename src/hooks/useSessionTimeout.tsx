
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

type SessionTimeoutOptions = {
  timeoutMinutes?: number;
  warningMinutes?: number;
  onTimeout?: () => void;
  onWarning?: () => void;
  debugMode?: boolean;
};

export const useSessionTimeout = ({
  timeoutMinutes = 30,
  warningMinutes = 5,
  onTimeout,
  onWarning,
  debugMode = false
}: SessionTimeoutOptions = {}) => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [warningShown, setWarningShown] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(timeoutMinutes * 60);
  
  const logActivity = useCallback(() => {
    setLastActivity(Date.now());
    setWarningShown(false);
  }, []);
  
  const resetSession = useCallback(() => {
    logActivity();
    
    if (debugMode) {
      console.log('Session timeout reset');
    }
    
    toast({
      title: "Session Extended",
      description: "Your session has been extended.",
    });
  }, [logActivity, toast, debugMode]);
  
  // Set up event listeners for user activity
  useEffect(() => {
    const activityEvents = [
      'mousedown', 'keypress', 'scroll', 'touchstart', 'click'
    ];
    
    const handleActivity = () => {
      logActivity();
    };
    
    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });
    
    // Clean up event listeners
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [logActivity]);
  
  // Check for timeout
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - lastActivity) / 1000);
      const remainingSeconds = (timeoutMinutes * 60) - elapsedSeconds;
      
      setTimeRemaining(remainingSeconds);
      
      // Check if warning should be shown
      if (remainingSeconds <= warningMinutes * 60 && !warningShown) {
        setWarningShown(true);
        
        toast({
          title: "Session Expiring Soon",
          description: `Your session will expire in ${warningMinutes} minutes due to inactivity.`,
          variant: "destructive",
          action: (
            <button onClick={resetSession} className="px-3 py-2 text-xs bg-white text-black rounded">
              Stay Logged In
            </button>
          ),
        });
        
        if (onWarning) {
          onWarning();
        }
        
        if (debugMode) {
          console.log(`Session warning: ${warningMinutes} minutes remaining`);
        }
      }
      
      // Check if session should timeout
      if (elapsedSeconds >= timeoutMinutes * 60) {
        if (debugMode) {
          console.log('Session timeout occurred');
        }
        
        // Clear the interval
        clearInterval(interval);
        
        // Show timeout notification
        toast({
          title: "Session Expired",
          description: "You have been logged out due to inactivity.",
          variant: "destructive",
        });
        
        // Call timeout callback if provided
        if (onTimeout) {
          onTimeout();
        }
        
        // Log out the user
        setTimeout(() => {
          signOut();
        }, 1000);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [lastActivity, timeoutMinutes, warningMinutes, signOut, toast, warningShown, onWarning, onTimeout, resetSession, debugMode]);
  
  return {
    resetSession,
    timeRemaining,
    formattedTimeRemaining: formatTime(timeRemaining),
    isWarning: warningShown
  };
};

const formatTime = (seconds: number): string => {
  if (seconds <= 0) return '00:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};
