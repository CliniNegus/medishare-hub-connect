
import React from 'react';
import OnboardingTour from '../OnboardingTour';
import { useTutorial } from '@/contexts/TutorialContext';

const RoleDashboardTutorial: React.FC = () => {
  const { showTutorial, setShowTutorial, getTutorialSteps, tourId } = useTutorial();

  const handleTutorialComplete = () => {
    setShowTutorial(false);
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
