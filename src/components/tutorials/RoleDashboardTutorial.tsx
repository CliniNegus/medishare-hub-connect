
import React from 'react';
import OnboardingTour from '../OnboardingTour';
import { useTutorial } from '@/contexts/TutorialContext';

const RoleDashboardTutorial: React.FC = () => {
  const { showTutorial, setShowTutorial, getTutorialSteps, tourId, markTutorialAsCompleted } = useTutorial();

  const handleTutorialComplete = async () => {
    setShowTutorial(false);
    // Mark tutorial as completed and update user profile
    await markTutorialAsCompleted();
  };

  const tutorialSteps = getTutorialSteps();

  if (!tutorialSteps.length) {
    return null;
  }

  return (
    <OnboardingTour
      tourSteps={tutorialSteps}
      onComplete={handleTutorialComplete}
      tourId={tourId}
    />
  );
};

export default RoleDashboardTutorial;
