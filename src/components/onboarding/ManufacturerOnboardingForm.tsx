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
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Factory,
  Package,
  Globe,
  Store,
  MapPin
} from 'lucide-react';

const PRODUCT_CATEGORIES = [
  'MRI Machines',
  'CT Scanners',
  'X-Ray Equipment',
  'Ultrasound Machines',
  'Ventilators',
  'Patient Monitors',
  'Surgical Equipment',
  'Laboratory Equipment',
  'Dialysis Machines',
  'Defibrillators',
  'Medical Consumables',
  'Diagnostic Kits'
];

const TARGET_MARKETS = [
  'East Africa',
  'West Africa',
  'North Africa',
  'Southern Africa',
  'Middle East',
  'South Asia',
  'Southeast Asia',
  'Europe',
  'Americas'
];

const CERTIFICATIONS = [
  'FDA Approved',
  'CE Marked',
  'ISO 13485',
  'WHO Prequalified',
  'KEBS Certified',
  'Other'
];

const STEPS = [
  { id: 1, title: 'Company Info', icon: Factory },
  { id: 2, title: 'Products', icon: Package },
  { id: 3, title: 'Markets', icon: Globe },
  { id: 4, title: 'Shop Setup', icon: Store }
];

const ManufacturerOnboardingForm = () => {
  const { user, refreshProfile, refreshRoles } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    manufacturing_location: '',
    products_available: [] as string[],
    target_markets: [] as string[],
    certifications: [] as string[],
    company_description: ''
  });

  const handleProductToggle = (item: string) => {
    setFormData(prev => ({
      ...prev,
      products_available: prev.products_available.includes(item)
        ? prev.products_available.filter(i => i !== item)
        : [...prev.products_available, item]
    }));
  };

  const handleMarketToggle = (item: string) => {
    setFormData(prev => ({
      ...prev,
      target_markets: prev.target_markets.includes(item)
        ? prev.target_markets.filter(i => i !== item)
        : [...prev.target_markets, item]
    }));
  };

  const handleCertificationToggle = (item: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(item)
        ? prev.certifications.filter(i => i !== item)
        : [...prev.certifications, item]
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.manufacturing_location;
      case 2:
        return formData.products_available.length > 0;
      case 3:
        return formData.target_markets.length > 0;
      case 4:
        return true; // Shop setup info is optional
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
          manufacturing_location: formData.manufacturing_location,
          products_available: formData.products_available,
          target_markets: formData.target_markets,
          certifications: formData.certifications,
          bio: formData.company_description,
          onboarding_completed: true,
          profile_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Refresh both profile and roles to ensure dashboard loads correctly
      await Promise.all([refreshProfile(), refreshRoles()]);

      toast({
        title: "Welcome to CliniBuilds!",
        description: "Your manufacturer profile is set up. Start adding products to your shop.",
      });

      navigate('/manufacturer/products');
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
              <Factory className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Manufacturer Setup</CardTitle>
            <CardDescription>
              Set up your company to reach healthcare facilities
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
                  <MapPin className="w-5 h-5 text-primary" />
                  Manufacturing Location
                </h3>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Where are your products manufactured? <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={formData.manufacturing_location}
                    onChange={(e) => setFormData(prev => ({ ...prev, manufacturing_location: e.target.value }))}
                    placeholder="e.g., Nairobi, Kenya or Multiple Locations"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Certifications</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CERTIFICATIONS.map((cert) => (
                      <div
                        key={cert}
                        onClick={() => handleCertificationToggle(cert)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          formData.certifications.includes(cert)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox checked={formData.certifications.includes(cert)} />
                          <span className="text-sm">{cert}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Products Available
                </h3>
                <p className="text-sm text-muted-foreground">
                  What types of products do you manufacture or supply?
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {PRODUCT_CATEGORIES.map((item) => (
                    <div
                      key={item}
                      onClick={() => handleProductToggle(item)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.products_available.includes(item)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox checked={formData.products_available.includes(item)} />
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
                  <Globe className="w-5 h-5 text-primary" />
                  Target Markets
                </h3>
                <p className="text-sm text-muted-foreground">
                  Which regions are you looking to expand into?
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {TARGET_MARKETS.map((market) => (
                    <div
                      key={market}
                      onClick={() => handleMarketToggle(market)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.target_markets.includes(market)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox checked={formData.target_markets.includes(market)} />
                        <span className="font-medium">{market}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Store className="w-5 h-5 text-primary" />
                  Your Shop
                </h3>
                
                <div className="bg-primary/5 rounded-xl p-6 space-y-4">
                  <h4 className="font-semibold">🎉 You're almost ready!</h4>
                  <p className="text-sm text-muted-foreground">
                    After completing this setup, you'll be able to:
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Create your manufacturer shop
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      List products for hospitals to discover
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Receive orders and manage inventory
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Track analytics and performance
                    </li>
                  </ul>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company Description (optional)
                  </label>
                  <Textarea
                    value={formData.company_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_description: e.target.value }))}
                    placeholder="Tell hospitals about your company, quality standards, and what makes you unique..."
                    rows={4}
                  />
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
                  {loading ? "Setting up..." : "Launch My Shop"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManufacturerOnboardingForm;
