
import React, { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { X, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { useTutorial } from '@/contexts/TutorialContext';

type TourStep = {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position: 'top' | 'right' | 'bottom' | 'left';
};

interface OnboardingTourProps {
  tourSteps: TourStep[];
  onComplete?: () => void;
  tourId: string;
}

export function OnboardingTour({ tourSteps, onComplete, tourId }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const [showTourMenu, setShowTourMenu] = useState(false);
  const { toast } = useToast();
  const { showTutorial: shouldShowTour, setShowTutorial, resetTutorial } = useTutorial();

  useEffect(() => {
    // Use the value from the TutorialContext to decide if we should show the tour
    setShowTour(shouldShowTour);
  }, [shouldShowTour]);

  useEffect(() => {
    // Check if the user has already seen this tour
    const tourSeen = localStorage.getItem(`tour-${tourId}-completed`);
    if (!tourSeen) {
      setTimeout(() => {
        setShowTour(true);
        setShowTutorial(true);
      }, 1000); // Delay to ensure the page is fully loaded
    }
  }, [tourId, setShowTutorial]);

  const handleSkipTour = () => {
    setShowTour(false);
    setShowTutorial(false);
    localStorage.setItem(`tour-${tourId}-completed`, 'true');
    if (onComplete) {
      onComplete();
    }
  };

  const handleNextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowTour(false);
      setShowTutorial(false);
      localStorage.setItem(`tour-${tourId}-completed`, 'true');
      toast({
        title: "Tour completed",
        description: "You've completed the onboarding tour!",
      });
      if (onComplete) {
        onComplete();
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRestartTour = () => {
    setCurrentStep(0);
    resetTutorial();
    setShowTourMenu(false);
  };

  const currentTourStep = tourSteps[currentStep];

  return (
    <>
      {/* Tour Helper Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="fixed right-4 bottom-20 z-50 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg"
              onClick={() => setShowTourMenu(true)}
            >
              <HelpCircle className="h-5 w-5" />
              <span className="sr-only">Help</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Get Help & Take a Tour</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Tour Menu Dialog */}
      <Dialog open={showTourMenu} onOpenChange={setShowTourMenu}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Help & Onboarding</DialogTitle>
            <DialogDescription>
              Learn how to use the application with our guided tour.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Button 
              className="w-full bg-red-600 hover:bg-red-700" 
              onClick={handleRestartTour}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Restart Tour
            </Button>
            
            <div className="text-sm space-y-2">
              <h4 className="font-semibold">Quick Links</h4>
              <ul className="space-y-1">
                <li>
                  <Button variant="link" className="p-0 h-auto text-red-600">
                    View Documentation
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-red-600">
                    Contact Support
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tour Main Dialog */}
      {showTour && currentTourStep && (
        <Dialog open={showTour} onOpenChange={setShowTour}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{currentTourStep.title}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Step {currentStep + 1} of {tourSteps.length}
                </span>
              </DialogTitle>
              <DialogDescription>
                {currentTourStep.description}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex items-center justify-between">
              <div>
                <Button 
                  variant="outline" 
                  onClick={handleSkipTour} 
                  className="mr-2"
                >
                  Skip Tour
                </Button>
                {currentStep > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={handlePrevStep}
                  >
                    Previous
                  </Button>
                )}
              </div>
              <Button 
                onClick={handleNextStep}
                className="bg-red-600 hover:bg-red-700"
              >
                {currentStep < tourSteps.length - 1 ? 'Next' : 'Finish'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default OnboardingTour;
