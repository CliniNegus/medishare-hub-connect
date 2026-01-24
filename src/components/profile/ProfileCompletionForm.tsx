import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import ImageUpload from '@/components/products/ImageUpload';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  UserRound, 
  MapPin, 
  Phone, 
  Building2,
  Upload,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Hospital,
  Factory,
  TrendingUp
} from 'lucide-react';

interface ProfileData {
  full_name: string;
  phone: string;
  logo_url: string;
  location: string;
  organization: string;
  bio: string;
}

type AccountType = 'hospital' | 'manufacturer' | 'investor' | null;

const ACCOUNT_TYPES = [
  { 
    id: 'hospital' as const, 
    title: 'Hospital / Clinic', 
    description: 'Access equipment marketplace, manage inventory, and connect with manufacturers',
    icon: Hospital
  },
  { 
    id: 'manufacturer' as const, 
    title: 'Manufacturer', 
    description: 'List your medical equipment, manage orders, and reach healthcare facilities',
    icon: Factory
  },
  { 
    id: 'investor' as const, 
    title: 'Investor', 
    description: 'Discover investment opportunities in medical equipment and healthcare',
    icon: TrendingUp
  }
];

const STEPS = [
  { id: 1, title: 'Account Type', description: 'Choose your role' },
  { id: 2, title: 'Basic Info', description: 'Your personal details' },
  { id: 3, title: 'Contact & Location', description: 'How to reach you' },
  { id: 4, title: 'Organization', description: 'Your workplace info' },
  { id: 5, title: 'Profile Picture', description: 'Add your photo' }
];

const ProfileCompletionForm = () => {
  const { user, profile, refreshProfile, userRoles, refreshRoles } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType>(null);
  const [formData, setFormData] = useState<ProfileData>({
    full_name: '',
    phone: '',
    logo_url: '',
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
        location: profile.location || '',
        organization: profile.organization || '',
        bio: profile.bio || ''
      });
      
      // If user already has a role, skip step 1
      if (userRoles.primaryRole && userRoles.primaryRole !== 'admin') {
        setSelectedAccountType(userRoles.primaryRole as AccountType);
        setCurrentStep(Math.max(profile.profile_completion_step || 2, 2));
      } else {
        setCurrentStep(profile.profile_completion_step || 1);
      }
      
      // Load draft if exists
      if (profile.profile_draft && typeof profile.profile_draft === 'object') {
        const draft = profile.profile_draft as Record<string, any>;
        if (Object.keys(draft).length > 0) {
          setFormData(prev => ({ ...prev, ...draft }));
          if (draft.selectedAccountType) {
            setSelectedAccountType(draft.selectedAccountType);
          }
        }
      }
    }
  }, [profile, userRoles.primaryRole]);

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!selectedAccountType;
      case 2:
        return !!formData.full_name;
      case 3:
        return !!(formData.phone && formData.location);
      case 4:
        return !!formData.organization;
      case 5:
        return true;
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
          profile_draft: { ...formData, selectedAccountType } as any,
          profile_completion_step: currentStep,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const saveUserRole = async (role: AccountType) => {
    if (!role) return false;
    
    try {
      // Get fresh session to ensure we have the correct user ID
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession?.user?.id) {
        toast({
          title: "Session expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
        return false;
      }
      
      const userId = currentSession.user.id;
      console.log('Saving role for user:', userId, 'Role:', role);
      
      // Check if role already exists
      const { data: existingRole, error: selectError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .eq('role', role)
        .maybeSingle();
      
      if (selectError) {
        console.error('Error checking existing role:', selectError);
      }
      
      if (existingRole) {
        console.log('Role already exists:', existingRole);
        // Role already exists, no need to insert
        if (refreshRoles) {
          await refreshRoles();
        }
        return true;
      }
      
      // Insert the new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });
      
      if (insertError) {
        console.error('Error inserting role:', insertError);
        // If it's a duplicate key error, treat as success
        if (insertError.code === '23505') {
          if (refreshRoles) {
            await refreshRoles();
          }
          return true;
        }
        throw insertError;
      }
      
      console.log('Role saved successfully');
      
      // Refresh roles in context
      if (refreshRoles) {
        await refreshRoles();
      }
      
      return true;
    } catch (error: any) {
      console.error('Error saving user role:', error);
      toast({
        title: "Error saving account type",
        description: error.message || "Failed to save account type. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Please fill required fields",
        description: currentStep === 1 
          ? "Please select an account type to continue."
          : "All required fields must be completed before proceeding.",
        variant: "destructive",
      });
      return;
    }

    // Special handling for manufacturer - redirect to specialized onboarding after step 1
    if (currentStep === 1 && selectedAccountType === 'manufacturer') {
      setLoading(true);
      try {
        // Save the role first
        const roleSuccess = await saveUserRole('manufacturer');
        if (!roleSuccess) {
          setLoading(false);
          return;
        }
        
        // Save basic profile data with role
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            ...formData,
            profile_draft: {},
            profile_completion_step: 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', user?.id);

        if (profileError) throw profileError;

        toast({
          title: "Great choice!",
          description: "Let's set up your manufacturer account.",
        });

        // Redirect to manufacturer-specific onboarding
        navigate('/manufacturer/onboarding');
        return;
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to proceed. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    }

    // Don't save role here - save it at the end with profile completion
    // Just move to next step and save draft
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      await saveDraft();
    }
  };

  const handlePrevious = () => {
    // If user already has a role assigned, don't go back to step 1
    const minStep = userRoles.primaryRole ? 2 : 1;
    if (currentStep > minStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    // Validate all required fields
    const requiredFields = ['full_name', 'phone', 'location', 'organization'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof ProfileData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please complete: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    // Validate account type is selected
    if (!selectedAccountType) {
      toast({
        title: "Account type required",
        description: "Please go back and select an account type.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // First, save the profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          ...formData,
          profile_completed: true,
          profile_completion_step: STEPS.length,
          profile_draft: {},
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Now save the role (profile is guaranteed to exist now)
      const roleSuccess = await saveUserRole(selectedAccountType);
      if (!roleSuccess) {
        // Revert profile completion if role save fails
        await supabase
          .from('profiles')
          .update({ profile_completed: false })
          .eq('id', user.id);
        setLoading(false);
        return;
      }

      await refreshProfile();

      toast({
        title: "Profile completed!",
        description: "Welcome to the platform! You can now access all features.",
      });

      // Redirect based on selected account type
      if (userRoles.isAdmin) {
        navigate('/admin');
      } else if (selectedAccountType === 'manufacturer') {
        navigate('/manufacturer/products');
      } else if (selectedAccountType === 'investor') {
        navigate('/investor');
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
                  Select Account Type <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choose the type of account that best describes how you'll use the platform
                </p>
                
                <div className="grid gap-4 mt-4">
                  {ACCOUNT_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedAccountType === type.id;
                    return (
                      <div
                        key={type.id}
                        onClick={() => setSelectedAccountType(type.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-[#E02020] bg-red-50' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-full ${isSelected ? 'bg-[#E02020] text-white' : 'bg-gray-100'}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{type.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                          </div>
                          {isSelected && (
                            <CheckCircle className="w-5 h-5 text-[#E02020]" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {currentStep === 2 && (
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

            {currentStep === 3 && (
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

            {currentStep === 4 && (
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

            {currentStep === 5 && (
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
                disabled={currentStep === 1 || (currentStep === 2 && !!userRoles.primaryRole)}
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
                    disabled={loading}
                    className="bg-[#E02020] hover:bg-[#c01010]"
                  >
                    {loading ? "Saving..." : "Next"}
                    {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
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