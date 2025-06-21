
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import CreateAdminUserForm from './CreateAdminUserForm';
import { Loader2 } from 'lucide-react';

const SettingsPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { settings, loading, saving, saveSettings } = useSystemSettings();
  
  // Local form state
  const [formSettings, setFormSettings] = useState(settings);

  // Update form when settings load
  React.useEffect(() => {
    setFormSettings(settings);
  }, [settings]);

  const handlePlatformSettingsSave = async () => {
    const platformSettings = {
      systemName: formSettings.systemName,
      defaultCurrency: formSettings.defaultCurrency,
      maintenanceMode: formSettings.maintenanceMode,
    };

    const success = await saveSettings(platformSettings);
    if (success) {
      console.log('Platform settings saved successfully');
    }
  };

  const handleNotificationSettingsSave = async () => {
    const notificationSettings = {
      emailNotifications: formSettings.emailNotifications,
      notificationFrequency: formSettings.notificationFrequency,
      notifyOrders: formSettings.notifyOrders,
      notifyMaintenance: formSettings.notifyMaintenance,
      notifySystem: formSettings.notifySystem,
    };

    const success = await saveSettings(notificationSettings);
    if (success) {
      console.log('Notification settings saved successfully');
    }
  };

  const handleSystemBackup = async () => {
    try {
      toast({
        title: "Backup Started",
        description: "System backup has been initiated.",
      });

      const { data, error } = await supabase.rpc('create_data_backup', {
        name_param: 'Manual Admin Backup',
        backup_type_param: 'full'
      });

      if (error) throw error;

      setTimeout(() => {
        toast({
          title: "Backup Completed",
          description: "System backup has been completed successfully.",
        });
      }, 2000);

    } catch (error) {
      console.error("Error performing system backup:", error);
      toast({
        title: "Error",
        description: "Failed to perform system backup. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#333333]">Settings</h2>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>
                  Configure general platform settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="system-name">System Name</Label>
                  <Input 
                    id="system-name" 
                    value={formSettings.systemName}
                    onChange={(e) => setFormSettings(prev => ({ ...prev, systemName: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <select 
                    id="currency"
                    value={formSettings.defaultCurrency}
                    onChange={(e) => setFormSettings(prev => ({ ...prev, defaultCurrency: e.target.value }))}
                    className="w-full p-2 border rounded"
                  >
                    <option value="KES">Kenyan Shilling (KES)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="NGN">Nigerian Naira (NGN)</option>
                    <option value="GBP">British Pound (GBP)</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenance">Maintenance Mode</Label>
                  <Switch 
                    id="maintenance" 
                    checked={formSettings.maintenanceMode}
                    onCheckedChange={(checked) => setFormSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                  />
                </div>
                
                <Button 
                  onClick={handlePlatformSettingsSave} 
                  disabled={saving}
                  className="bg-[#E02020] hover:bg-[#c01c1c] mt-2"
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Platform Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure system notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch 
                    id="email-notifications" 
                    checked={formSettings.emailNotifications}
                    onCheckedChange={(checked) => setFormSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notifications-frequency">Notification Frequency</Label>
                  <select 
                    id="notifications-frequency"
                    value={formSettings.notificationFrequency}
                    onChange={(e) => setFormSettings(prev => ({ ...prev, notificationFrequency: e.target.value }))}
                    className="w-full p-2 border rounded"
                  >
                    <option value="realtime">Real-time</option>
                    <option value="hourly">Hourly Digest</option>
                    <option value="daily">Daily Digest</option>
                    <option value="weekly">Weekly Digest</option>
                  </select>
                </div>
                
                <div className="space-y-2 pt-2">
                  <h4 className="font-medium">Notification Types</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-orders">Order Updates</Label>
                      <Switch
                        id="notify-orders"
                        checked={formSettings.notifyOrders}
                        onCheckedChange={(checked) => setFormSettings(prev => ({ ...prev, notifyOrders: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-maintenance">Maintenance Alerts</Label>
                      <Switch
                        id="notify-maintenance"
                        checked={formSettings.notifyMaintenance}
                        onCheckedChange={(checked) => setFormSettings(prev => ({ ...prev, notifyMaintenance: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-system">System Notifications</Label>
                      <Switch
                        id="notify-system"
                        checked={formSettings.notifySystem}
                        onCheckedChange={(checked) => setFormSettings(prev => ({ ...prev, notifySystem: checked }))}
                      />
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleNotificationSettingsSave}
                  disabled={saving}
                  className="bg-[#E02020] hover:bg-[#c01c1c] mt-2"
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CreateAdminUserForm />

            <Card>
              <CardHeader>
                <CardTitle>Promote User to Admin</CardTitle>
                <CardDescription>
                  Upgrade an existing user to admin role
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-email">User Email</Label>
                  <Input id="user-email" type="email" placeholder="Enter user email" />
                </div>
                
                <div className="space-y-2">
                  <Label>Confirmation</Label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="confirm-promotion" />
                    <Label htmlFor="confirm-promotion" className="text-sm text-gray-600">
                      I confirm that I want to promote this user to admin status
                    </Label>
                  </div>
                </div>
                
                <Button className="bg-[#E02020] hover:bg-[#c01c1c]">
                  Promote to Admin
                </Button>
                
                <div className="pt-2 text-sm text-gray-600">
                  <p>Note: Admin users have full access to system settings and user management.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                View system details and configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Version</span>
                    <span>1.0.0</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Last Updated</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Environment</span>
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">
                      Production
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">System Management</span>
                    <Button 
                      variant="link"
                      onClick={() => window.location.href = '/system'}
                      className="text-[#E02020] hover:text-[#c01c1c] p-0"
                    >
                      Open System Management
                    </Button>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Current Currency</span>
                    <span className="bg-blue-50 px-2 py-1 rounded text-xs">
                      {settings.defaultCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Maintenance Mode</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      settings.maintenanceMode 
                        ? 'bg-red-50 text-red-600' 
                        : 'bg-green-50 text-green-600'
                    }`}>
                      {settings.maintenanceMode ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 pt-4">
                  <h3 className="font-medium">System Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline"
                      className="border-[#E02020] text-[#E02020] hover:bg-[#E02020] hover:text-white"
                      onClick={handleSystemBackup}
                    >
                      Create System Backup
                    </Button>
                    <Button variant="outline">
                      Clear Cache
                    </Button>
                    <Button variant="outline">
                      Run System Diagnostics
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPanel;
