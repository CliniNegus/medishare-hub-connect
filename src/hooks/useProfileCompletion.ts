import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface ProfileCompletionReminder {
  id: string;
  message: string;
  show: boolean;
}

export const useProfileCompletion = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const checkProfileCompletion = useCallback(() => {
    if (!profile) return false;
    
    const requiredFields = ['full_name', 'phone', 'location', 'organization', 'gender'];
    const missingFields = requiredFields.filter(field => !profile[field]);
    
    return {
      isComplete: profile.profile_completed && missingFields.length === 0,
      missingFields,
      completionPercentage: ((requiredFields.length - missingFields.length) / requiredFields.length) * 100
    };
  }, [profile]);

  const saveProfileDraft = useCallback(async (draftData: Record<string, any>) => {
    if (!user) return false;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          profile_draft: draftData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast({
        title: "Draft saved",
        description: "Your progress has been saved.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error saving draft",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const showCompletionReminder = useCallback(() => {
    const completionStatus = checkProfileCompletion();
    
    if (completionStatus && !completionStatus.isComplete && profile && !profile.profile_completed) {
      toast({
        title: "Complete your profile",
        description: `Your profile is ${Math.round(completionStatus.completionPercentage)}% complete. Finish it to unlock all features.`,
      });
    }
  }, [checkProfileCompletion, profile, toast]);

  const updateProfileCompletionStep = useCallback(async (step: number) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          profile_completion_step: step,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      await refreshProfile();
      return true;
    } catch (error) {
      console.error('Error updating completion step:', error);
      return false;
    }
  }, [user, refreshProfile]);

  return {
    loading,
    checkProfileCompletion,
    saveProfileDraft,
    showCompletionReminder,
    updateProfileCompletionStep,
    isProfileIncomplete: profile && !profile.profile_completed,
    completionStep: profile?.profile_completion_step || 0
  };
};