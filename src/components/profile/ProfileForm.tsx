
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from '@/contexts/UserRoleContext';
import ImageUpload from '@/components/products/ImageUpload';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { 
  UserRound, 
  Mail, 
  Building2, 
  Upload, 
  X, 
  MapPin, 
  Phone, 
  Link,
  Calendar,
  Lock
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ProfileForm = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { role } = useUserRole();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    organization: '',
    logo_url: '',
    bio: '',
    location: '',
    phone: '',
    website: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        organization: profile.organization || '',
        logo_url: profile.logo_url || '',
        bio: profile.bio || '',
        location: profile.location || '',
        phone: profile.phone || '',
        website: profile.website || ''
      });
    }
  }, [profile]);

  const handleLogoUpload = (url: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to update your profile.",
        variant: "destructive",
      });
      return;
    }
    setFormData(prev => ({ ...prev, logo_url: url }));
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
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
          bio: formData.bio,
          location: formData.location,
          phone: formData.phone,
          website: formData.website,
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

  if (!user) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-red-600">Authentication Required</CardTitle>
          <CardDescription>Please sign in to access your profile settings.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto shadow-md border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-[#E02020]">Personal Profile</CardTitle>
            <CardDescription>Manage your personal information and organization details</CardDescription>
          </div>
          <Badge variant={role === 'admin' ? "destructive" : "secondary"} className="capitalize">
            {role || 'User'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Avatar Section */}
            <div className="md:col-span-1">
              <div className="flex flex-col items-center space-y-4 p-6 border border-gray-200 rounded-lg bg-gray-50">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    {formData.logo_url ? (
                      <AvatarImage src={formData.logo_url} alt={formData.full_name} />
                    ) : (
                      <AvatarFallback className="text-3xl bg-[#E02020] text-white">
                        {getInitials(formData.full_name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Button
                    type="button"
                    size="icon"
                    className="absolute bottom-0 right-0 bg-[#E02020] hover:bg-red-700 text-white rounded-full h-8 w-8 shadow-md"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-gray-900">{formData.full_name || 'Your Name'}</h3>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
                <div className="hidden">
                  <ImageUpload
                    id="logo-upload"
                    onImageUploaded={handleLogoUpload}
                    currentImageUrl={formData.logo_url}
                  />
                </div>
                <div className="w-full text-center">
                  <p className="text-sm text-gray-500 mb-2">Account created</p>
                  <p className="text-sm font-medium">
                    {new Date(user.created_at || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Details Form */}
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <UserRound className="inline-block mr-2 h-5 w-5 text-[#E02020]" />
                  Personal Information
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Your full name"
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      value={user.email || ''}
                      disabled
                      className="bg-gray-50 border-gray-300 text-gray-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <Textarea
                      id="bio"
                      value={formData.bio || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="A brief description about yourself"
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500 resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Building2 className="inline-block mr-2 h-5 w-5 text-[#E02020]" />
                  Organization Details
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Name
                    </label>
                    <Input
                      id="organization"
                      value={formData.organization}
                      onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                      placeholder="Your organization or company name"
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <div className="relative">
                      <Input
                        id="location"
                        value={formData.location || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="City, Country"
                        className="pl-9 border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Input
                          id="phone"
                          value={formData.phone || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+1 (123) 456-7890"
                          className="pl-9 border-gray-300 focus:border-red-500 focus:ring-red-500"
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <div className="relative">
                        <Input
                          id="website"
                          value={formData.website || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://example.com"
                          className="pl-9 border-gray-300 focus:border-red-500 focus:ring-red-500"
                        />
                        <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              className="border-gray-300 text-gray-700"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#E02020] hover:bg-[#c01010] text-white" 
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
