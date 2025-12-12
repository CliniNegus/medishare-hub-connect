import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import ImageUpload from '@/components/products/ImageUpload';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  UserRound, 
  MapPin, 
  Phone, 
  Building2,
  Upload,
  CheckCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface ProfileData {
  full_name: string;
  phone: string;
  logo_url: string;
  gender: string;
  location: string;
  organization: string;
  bio: string;
}

const STEPS = [
  { id: 1, title: 'Basic Info', description: 'Your personal details' },
  { id: 2, title: 'Contact & Location', description: 'How to reach you' },
  { id: 3, title: 'Organization', description: 'Your workplace info' },
  { id: 4, title: 'Profile Picture', description: 'Add your photo' }
];

const ProfileCompletionForm = () => {
  const { user, profile, refreshProfile, userRoles } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProfileData>({
    full_name: '',
    phone: '',
    logo_url: '',
    gender: '',
    location: '',
    organization: '',
    bio: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        logo_url: profile.logo_url || '',
        gender: profile.gender || '',
        location: profile.location || '',
        organization: profile.organization || '',
        bio: profile.bio || ''
      });
      setCurrentStep(profile.profile_completion_step || 1);
      
      // Load draft if exists
      if (profile.profile_draft && Object.keys(profile.profile_draft).length > 0) {
        setFormData(prev => ({ ...prev, ...profile.profile_draft }));
      }
    }
  }, [profile]);

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.full_name && formData.gender);
      case 2:
        return !!(formData.phone && formData.location);
      case 3:
        return !!formData.organization;
      case 4:
        return true; // Profile picture is optional
      default:
        return false;
    }
  };

  const saveDraft = async () => {
    if (!user) return;
    
    try {
      await supabase
        .from('profiles')
        .update({
          profile_draft: formData as any,
          profile_completion_step: currentStep,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Please fill required fields",
        description: "All required fields must be completed before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      await saveDraft();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    // Validate all required fields
    const requiredFields = ['full_name', 'phone', 'location', 'organization', 'gender'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof ProfileData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please complete: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          profile_completed: true,
          profile_completion_step: STEPS.length,
          profile_draft: {},
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();

      toast({
        title: "Profile completed!",
        description: "Welcome to the platform! You can now access all features.",
      });

      // Redirect based on user role
      if (userRoles.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Error completing profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (url: string) => {
    setFormData(prev => ({ ...prev, logo_url: url }));
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-[#E02020]">
              Complete Your Profile
            </CardTitle>
            <CardDescription>
              Just a few more details to get you started
            </CardDescription>
            
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-500 mt-2">
                Step {currentStep} of {STEPS.length}
              </p>
            </div>

            <div className="flex justify-between mt-4 text-xs">
              {STEPS.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.id <= currentStep ? 'bg-[#E02020] text-white' : 'bg-gray-200'
                  }`}>
                    {step.id < currentStep ? <CheckCircle className="w-4 h-4" /> : step.id}
                  </div>
                  <span className="mt-1 text-center">{step.title}</span>
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <UserRound className="w-5 h-5 mr-2 text-[#E02020]" />
                  Basic Information
                </h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <Input value={user?.email || ''} disabled className="bg-gray-50" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bio (Optional)</label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-[#E02020]" />
                  Contact & Location
                </h3>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, Country"
                      className="pl-9"
                      required
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-[#E02020]" />
                  Organization Details
                </h3>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Organization Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.organization}
                    onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                    placeholder="Your company or organization"
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-[#E02020]" />
                  Profile Picture (Optional)
                </h3>

                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    {formData.logo_url ? (
                      <AvatarImage src={formData.logo_url} alt={formData.full_name} />
                    ) : (
                      <AvatarFallback className="text-3xl bg-[#E02020] text-white">
                        {getInitials(formData.full_name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <ImageUpload
                    onImageUploaded={handleLogoUpload}
                    currentImageUrl={formData.logo_url}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={saveDraft}
                  disabled={loading}
                >
                  Save Draft
                </Button>
                
                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-[#E02020] hover:bg-[#c01010]"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-[#E02020] hover:bg-[#c01010]"
                  >
                    {loading ? "Completing..." : "Complete Profile"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileCompletionForm;