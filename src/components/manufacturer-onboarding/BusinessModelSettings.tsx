import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Save, AlertTriangle, CheckCircle2 } from 'lucide-react';
import BusinessModelSelector, { BusinessModelType } from './BusinessModelSelector';

interface BusinessModelSettingsProps {
  onClose?: () => void;
}

const BusinessModelSettings: React.FC<BusinessModelSettingsProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedModels, setSelectedModels] = useState<BusinessModelType[]>([]);
  const [originalModels, setOriginalModels] = useState<BusinessModelType[]>([]);
  const [status, setStatus] = useState<string>('draft');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      loadBusinessModels();
    }
  }, [user]);

  useEffect(() => {
    // Check if there are unsaved changes
    const changed = JSON.stringify(selectedModels.sort()) !== JSON.stringify(originalModels.sort());
    setHasChanges(changed);
  }, [selectedModels, originalModels]);

  const loadBusinessModels = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('manufacturer_onboarding')
        .select('business_models, business_model, status')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        // Use business_models array if available, fallback to business_model
        let models: BusinessModelType[] = [];
        if (data.business_models && Array.isArray(data.business_models) && data.business_models.length > 0) {
          models = data.business_models as BusinessModelType[];
        } else if (data.business_model) {
          models = [data.business_model as BusinessModelType];
        }
        
        setSelectedModels(models);
        setOriginalModels(models);
        setStatus(data.status || 'draft');
      }
    } catch (error: any) {
      console.error('Error loading business models:', error);
      toast({
        title: 'Error loading settings',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || selectedModels.length === 0) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('manufacturer_onboarding')
        .update({
          business_models: selectedModels,
          // Also update single field for backward compatibility
          business_model: selectedModels[0],
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setOriginalModels([...selectedModels]);
      toast({
        title: 'Business models updated',
        description: 'Your business model preferences have been saved successfully.',
      });
      
      onClose?.();
    } catch (error: any) {
      console.error('Error saving business models:', error);
      toast({
        title: 'Error saving settings',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const isReadOnly = status === 'pending' || status === 'approved';

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isReadOnly && (
        <Alert variant="default" className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 dark:text-amber-400">
            Settings Locked
          </AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-500">
            {status === 'pending' 
              ? 'Your onboarding is under review. Business model changes are locked until review is complete.'
              : 'Your onboarding has been approved. Contact admin to request business model changes.'
            }
          </AlertDescription>
        </Alert>
      )}

      <BusinessModelSelector
        selectedModels={selectedModels}
        onSelectionChange={setSelectedModels}
        isReadOnly={isReadOnly}
        showHeader={true}
      />

      {!isReadOnly && (
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {hasChanges ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Unsaved changes
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                All changes saved
              </>
            )}
          </div>
          <div className="flex gap-2">
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={saving || selectedModels.length === 0 || !hasChanges}
              className="bg-primary hover:bg-primary/90"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessModelSettings;
