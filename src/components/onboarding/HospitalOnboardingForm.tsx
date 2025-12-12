import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Building2, 
  Stethoscope,
  CreditCard,
  MapPin,
  Hospital
} from 'lucide-react';

const EQUIPMENT_CATEGORIES = [
  'MRI Machines',
  'CT Scanners',
  'X-Ray Equipment',
  'Ultrasound Machines',
  'Ventilators',
  'Patient Monitors',
  'Surgical Equipment',
  'Laboratory Equipment',
  'Dialysis Machines',
  'Defibrillators'
];

const FINANCING_OPTIONS = [
  'Leasing',
  'Pay-per-use',
  'Direct Purchase',
  'Investment Partnership',
  'Equipment Sharing'
];

const HOSPITAL_TYPES = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'diagnostic_center', label: 'Diagnostic Center' },
  { value: 'nursing_home', label: 'Nursing Home' },
  { value: 'specialty_center', label: 'Specialty Center' }
];

const STEPS = [
  { id: 1, title: 'Facility Info', icon: Building2 },
  { id: 2, title: 'Equipment Needs', icon: Stethoscope },
  { id: 3, title: 'Financing', icon: CreditCard },
  { id: 4, title: 'Location', icon: MapPin }
];

const HospitalOnboardingForm = () => {
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    hospital_type: '',
    bed_capacity: '',
    equipment_needs: [] as string[],
    financing_needs: [] as string[],
    location: '',
    address: '',
    coordinates: { lat: 0, lng: 0 }
  });

  const handleEquipmentToggle = (item: string) => {
    setFormData(prev => ({
      ...prev,
      equipment_needs: prev.equipment_needs.includes(item)
        ? prev.equipment_needs.filter(i => i !== item)
        : [...prev.equipment_needs, item]
    }));
  };

  const handleFinancingToggle = (item: string) => {
    setFormData(prev => ({
      ...prev,
      financing_needs: prev.financing_needs.includes(item)
        ? prev.financing_needs.filter(i => i !== item)
        : [...prev.financing_needs, item]
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.hospital_type;
      case 2:
        return formData.equipment_needs.length > 0;
      case 3:
        return formData.financing_needs.length > 0;
      case 4:
        return !!formData.location;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Please complete this step",
        description: "Fill in the required fields before proceeding.",
        variant: "destructive",
      });
      return;
    }
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          hospital_type: formData.hospital_type,
          bed_capacity: formData.bed_capacity ? parseInt(formData.bed_capacity) : null,
          equipment_needs: formData.equipment_needs,
          financing_needs: formData.financing_needs,
          location: formData.location,
          coordinates: formData.coordinates,
          onboarding_completed: true,
          profile_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();

      toast({
        title: "Onboarding complete!",
        description: "Welcome to CliniBuilds. Your facility is now set up.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error completing onboarding",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <Hospital className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Hospital/Clinic Setup</CardTitle>
            <CardDescription>
              Let's set up your facility to find the right equipment
            </CardDescription>

            <div className="mt-6">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-4">
                {STEPS.map((step) => (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      step.id <= currentStep 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {step.id < currentStep ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className="text-xs mt-2 font-medium">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Facility Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Facility Type <span className="text-destructive">*</span>
                    </label>
                    <Select 
                      value={formData.hospital_type} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, hospital_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select facility type" />
                      </SelectTrigger>
                      <SelectContent>
                        {HOSPITAL_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Bed Capacity (optional)
                    </label>
                    <Input
                      type="number"
                      value={formData.bed_capacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, bed_capacity: e.target.value }))}
                      placeholder="e.g., 100"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  Equipment Needs
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select all equipment categories you're interested in:
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {EQUIPMENT_CATEGORIES.map((item) => (
                    <div
                      key={item}
                      onClick={() => handleEquipmentToggle(item)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.equipment_needs.includes(item)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox checked={formData.equipment_needs.includes(item)} />
                        <span className="text-sm font-medium">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Financing Preferences
                </h3>
                <p className="text-sm text-muted-foreground">
                  How would you like to acquire equipment?
                </p>

                <div className="space-y-3">
                  {FINANCING_OPTIONS.map((item) => (
                    <div
                      key={item}
                      onClick={() => handleFinancingToggle(item)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.financing_needs.includes(item)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox checked={formData.financing_needs.includes(item)} />
                        <span className="font-medium">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Location Details
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your location helps us match you with nearby equipment and hospitals for sharing.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      City/Region <span className="text-destructive">*</span>
                    </label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., Nairobi, Kenya"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Address (optional)
                    </label>
                    <Textarea
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter your facility's full address"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < STEPS.length ? (
                <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {loading ? "Completing..." : "Complete Setup"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HospitalOnboardingForm;
