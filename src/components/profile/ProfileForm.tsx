
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from '@/contexts/UserRoleContext';
import ImageUpload from '@/components/products/ImageUpload';
import { Upload } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ProfileForm = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { role } = useUserRole();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    organization: '',
    logo_url: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        organization: profile.organization || '',
        logo_url: profile.logo_url || ''
      });
    }
  }, [profile]);

  const handleLogoUpload = (url: string) => {
    setFormData(prev => ({ ...prev, logo_url: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          organization: formData.organization,
          logo_url: formData.logo_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      await refreshProfile();
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-red-600">Profile Settings</CardTitle>
        <CardDescription>Update your profile information and organization details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                Organization Logo
              </label>
              {formData.logo_url ? (
                <div className="relative w-full h-48 border border-gray-300 rounded-lg overflow-hidden mb-2">
                  <img 
                    src={formData.logo_url} 
                    alt="Organization logo" 
                    className="w-full h-full object-contain"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-white"
                    onClick={() => setFormData(prev => ({ ...prev, logo_url: '' }))}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div 
                  className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 mb-2"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload your organization logo</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                </div>
              )}
              <div className="hidden">
                <ImageUpload
                  id="logo-upload"
                  onImageUploaded={handleLogoUpload}
                  currentImageUrl={formData.logo_url}
                />
              </div>
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Enter your full name"
                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name
              </label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                placeholder="Enter your organization name"
                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white" 
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
