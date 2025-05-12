
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useUserRole, UserRole } from './UserRoleContext';
import { hospitalTutorialSteps, manufacturerTutorialSteps, investorTutorialSteps } from '../components/tutorials/TutorialSteps';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface TutorialContextType {
  showTutorial: boolean;
  setShowTutorial: (show: boolean) => void;
  tutorialCompleted: boolean;
  resetTutorial: () => void;
  getTutorialSteps: () => any[];
  tourId: string;
  markTutorialAsCompleted: () => Promise<void>;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider = ({ children }: { children: ReactNode }) => {
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [tutorialCompleted, setTutorialCompleted] = useState<boolean>(true);
  const { user, profile } = useAuth();
  const { role } = useUserRole();
  const [tourId, setTourId] = useState<string>('default-tour');
  const { toast } = useToast();

  // Determine if the tutorial should be shown based on user role and completion status
  useEffect(() => {
    if (user && profile) {
      const tourKey = `tour-${role}-completed`;
      const hasCompletedTour = localStorage.getItem(tourKey);
      
      setTutorialCompleted(!!hasCompletedTour);
      setTourId(`${role}-dashboard-tour`);
      
      // Show tutorial automatically only if:
      // 1. User is marked as a new user in their profile
      // 2. They haven't completed this role's tutorial yet
      if (profile.is_new_user && !hasCompletedTour) {
        // Small delay to ensure the dashboard components are loaded
        setTimeout(() => {
          setShowTutorial(true);
        }, 1000);
      }
    }
  }, [user, profile, role]);

  // Get tutorial steps based on user role
  const getTutorialSteps = () => {
    switch (role) {
      case 'hospital':
        return hospitalTutorialSteps;
      case 'manufacturer':
        return manufacturerTutorialSteps;
      case 'investor':
        return investorTutorialSteps;
      case 'admin':
        return []; // Admin tutorial can be added later
      default:
        return hospitalTutorialSteps; // Default to hospital tutorial
    }
  };

  // Mark tutorial as completed and update user profile
  const markTutorialAsCompleted = async () => {
    if (!user) return;

    try {
      // Mark as completed in localStorage
      const tourKey = `tour-${role}-completed`;
      localStorage.setItem(tourKey, 'true');
      setTutorialCompleted(true);
      
      // Update user profile to set is_new_user to false
      const { error } = await supabase
        .from('profiles')
        .update({ is_new_user: false })
        .eq('id', user.id);
        
      if (error) throw error;
    } catch (error: any) {
      console.error('Failed to mark tutorial as completed:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to update tutorial status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Reset tutorial to show it again
  const resetTutorial = () => {
    const tourKey = `tour-${role}-completed`;
    localStorage.removeItem(tourKey);
    setTutorialCompleted(false);
    setShowTutorial(true);
  };

  return (
    <TutorialContext.Provider
      value={{
        showTutorial,
        setShowTutorial,
        tutorialCompleted,
        resetTutorial,
        getTutorialSteps,
        tourId,
        markTutorialAsCompleted
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};
