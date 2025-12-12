
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface SettingsState {
  systemName: string;
  defaultCurrency: string;
  maintenanceMode: boolean;
  emailNotifications: boolean;
  notificationFrequency: string;
  notifyOrders: boolean;
  notifyMaintenance: boolean;
  notifySystem: boolean;
}

export const useSystemSettings = () => {
  const { user, userRoles } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingsState>({
    systemName: 'CliniBuilds Dashboard',
    defaultCurrency: 'KES',
    maintenanceMode: false,
    emailNotifications: true,
    notificationFrequency: 'realtime',
    notifyOrders: true,
    notifyMaintenance: true,
    notifySystem: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load settings from database
  const loadSettings = async () => {
    if (!user || !userRoles.isAdmin) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');

      if (error) throw error;

      if (data) {
        const settingsMap = new Map(data.map(setting => [setting.setting_key, setting.setting_value]));
        
        setSettings({
          systemName: (settingsMap.get('system_name') as string) || 'CliniBuilds Dashboard',
          defaultCurrency: (settingsMap.get('default_currency') as string) || 'KES',
          maintenanceMode: (settingsMap.get('maintenance_mode') as boolean) || false,
          emailNotifications: (settingsMap.get('email_notifications') as boolean) || true,
          notificationFrequency: (settingsMap.get('notification_frequency') as string) || 'realtime',
          notifyOrders: (settingsMap.get('notify_orders') as boolean) || true,
          notifyMaintenance: (settingsMap.get('notify_maintenance') as boolean) || true,
          notifySystem: (settingsMap.get('notify_system') as boolean) || true,
        });
      }
    } catch (error: any) {
      console.error('Error loading settings:', error);
      toast({
        title: 'Error Loading Settings',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Save settings to database
  const saveSettings = async (newSettings: Partial<SettingsState>) => {
    if (!user || !userRoles.isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'Only administrators can modify system settings',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setSaving(true);

      const settingsToUpdate = Object.entries(newSettings).map(([key, value]) => {
        // Convert camelCase to snake_case for database
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        return { setting_key: dbKey, setting_value: value };
      });

      // Update each setting
      for (const setting of settingsToUpdate) {
        const { error } = await supabase
          .from('system_settings')
          .update({ 
            setting_value: setting.setting_value,
            updated_at: new Date().toISOString()
          })
          .eq('setting_key', setting.setting_key);

        if (error) throw error;
      }

      // Update local state
      setSettings(prev => ({ ...prev, ...newSettings }));

      // Log audit event
      await supabase.rpc('log_audit_event', {
        action_param: 'UPDATE_SETTINGS',
        resource_type_param: 'system_settings',
        new_values_param: JSON.stringify(newSettings)
      });

      toast({
        title: 'Settings Saved',
        description: 'System settings have been updated successfully.',
      });

      return true;
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error Saving Settings',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [user, userRoles.isAdmin]);

  return {
    settings,
    loading,
    saving,
    saveSettings,
    refreshSettings: loadSettings,
  };
};
