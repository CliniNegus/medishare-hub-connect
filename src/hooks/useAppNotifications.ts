import { useEffect } from 'react';
import { useNotificationSystem } from './useNotificationSystem';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook that automatically integrates notification system across the app
 * Call this in your main components to enable automatic notification creation
 */
export const useAppNotifications = () => {
  const { user, profile } = useAuth();
  const { createNotification, notifyAllAdmins } = useNotificationSystem();

  // This hook automatically sets up real-time listeners for all notification events
  // The actual listeners are implemented in useNotificationSystem
  
  useEffect(() => {
    // Only initialize if user is logged in
    if (!user || !profile) return;
    
    console.log('App notifications initialized for user:', profile.role);
    
    // No additional setup needed - useNotificationSystem handles all the real-time listeners
    // This hook serves as the main entry point for notification functionality
  }, [user, profile]);

  // Return utility functions for manual notification creation if needed
  return {
    createNotification,
    notifyAllAdmins
  };
};