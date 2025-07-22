import React from 'react';
import { useAppNotifications } from '@/hooks/useAppNotifications';

/**
 * Component that initializes the notification system
 * Include this component in your main app layout to enable notifications
 */
const NotificationSystemInitializer = () => {
  // Initialize the notification system
  useAppNotifications();
  
  // This component doesn't render anything - it just initializes the system
  return null;
};

export default NotificationSystemInitializer;