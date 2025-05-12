
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useUserRole, UserRole } from './UserRoleContext';
import { hospitalTutorialSteps, manufacturerTutorialSteps, investorTutorialSteps } from '../components/tutorials/TutorialSteps';

interface TutorialContextType {
  showTutorial: boolean;
  setShowTutorial: (show: boolean) => void;
  tutorialCompleted: boolean;
  resetTutorial: () => void;
  getTutorialSteps: () => any[];
  tourId: string;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider = ({ children }: { children: ReactNode }) => {
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [tutorialCompleted, setTutorialCompleted] = useState<boolean>(true);
  const { user, profile } = useAuth();
  const { role } = useUserRole();
  const [tourId, setTourId] = useState<string>('default-tour');

  // Determine if the tutorial should be shown based on user role and completion status
  useEffect(() => {
    if (user && profile) {
      const tourKey = `tour-${role}-completed`;
      const hasCompletedTour = localStorage.getItem(tourKey);
      
      setTutorialCompleted(!!hasCompletedTour);
      setTourId(`${role}-dashboard-tour`);
      
      // If it's the first login for this role, show the tutorial automatically
      if (!hasCompletedTour) {
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
        tourId
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
