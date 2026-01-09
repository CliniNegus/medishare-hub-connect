import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  PiggyBank,
  Target,
  Wallet,
  BookOpen,
  TrendingUp,
  Shield,
  Coins
} from 'lucide-react';

const INVESTMENT_INTERESTS = [
  'Medical Imaging Equipment',
  'Surgical Equipment',
  'Diagnostic Equipment',
  'Laboratory Equipment',
  'Hospital Infrastructure',
  'Medical Consumables',
  'Healthcare Technology',
  'Telemedicine'
];

const BUDGET_RANGES = [
  { value: 'under_10k', label: 'Under $10,000' },
  { value: '10k_50k', label: '$10,000 - $50,000' },
  { value: '50k_100k', label: '$50,000 - $100,000' },
  { value: '100k_500k', label: '$100,000 - $500,000' },
  { value: '500k_1m', label: '$500,000 - $1,000,000' },
  { value: 'over_1m', label: 'Over $1,000,000' }
];

const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'New to Healthcare Investment' },
  { value: 'intermediate', label: 'Some Experience (1-3 years)' },
  { value: 'experienced', label: 'Experienced (3-5 years)' },
  { value: 'expert', label: 'Expert (5+ years)' }
];

const STEPS = [
  { id: 1, title: 'Interests', icon: Target },
  { id: 2, title: 'Budget', icon: Coins },
  { id: 3, title: 'Wallet', icon: Wallet },
  { id: 4, title: 'How It Works', icon: BookOpen }
];

const InvestorOnboardingForm = () => {
  const { user, refreshProfile, refreshRoles } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    investment_interests: [] as string[],
    investment_budget_range: '',
    investment_experience: '',
    wallet_address: ''
  });

  const handleInterestToggle = (item: string) => {
    setFormData(prev => ({
      ...prev,
      investment_interests: prev.investment_interests.includes(item)
        ? prev.investment_interests.filter(i => i !== item)
        : [...prev.investment_interests, item]
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.investment_interests.length > 0;
      case 2:
        return !!formData.investment_budget_range;
      case 3:
        return true; // Wallet is optional
      case 4:
        return true; // Educational step
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
          investment_interests: formData.investment_interests,
          investment_budget_range: formData.investment_budget_range,
          investment_experience: formData.investment_experience,
          wallet_address: formData.wallet_address || null,
          onboarding_completed: true,
          profile_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Refresh both profile and roles to ensure dashboard loads correctly
      await Promise.all([refreshProfile(), refreshRoles()]);

      toast({
        title: "Welcome, Investor!",
        description: "Your profile is set up. Explore investment opportunities.",
      });

      navigate('/investor');
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
              <PiggyBank className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Investor Setup</CardTitle>
            <CardDescription>
              Configure your investment preferences
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
                  <Target className="w-5 h-5 text-primary" />
                  Investment Interests
                </h3>
                <p className="text-sm text-muted-foreground">
                  What areas of healthcare equipment interest you?
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {INVESTMENT_INTERESTS.map((item) => (
                    <div
                      key={item}
                      onClick={() => handleInterestToggle(item)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.investment_interests.includes(item)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox checked={formData.investment_interests.includes(item)} />
                        <span className="text-sm font-medium">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Investment Experience
                  </label>
                  <Select 
                    value={formData.investment_experience} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, investment_experience: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Coins className="w-5 h-5 text-primary" />
                  Investment Budget
                </h3>
                <p className="text-sm text-muted-foreground">
                  What's your typical investment range?
                </p>

                <div className="space-y-3">
                  {BUDGET_RANGES.map((range) => (
                    <div
                      key={range.value}
                      onClick={() => setFormData(prev => ({ ...prev, investment_budget_range: range.value }))}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.investment_budget_range === range.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          formData.investment_budget_range === range.value
                            ? 'border-primary'
                            : 'border-muted-foreground'
                        }`}>
                          {formData.investment_budget_range === range.value && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <span className="font-medium">{range.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary" />
                  Blockchain Wallet (Optional)
                </h3>

                <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold">Blockchain-Based Financing</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        CliniBuilds uses blockchain technology for transparent and secure equipment financing. 
                        Connect your wallet to participate in smart contract-based investments.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Wallet Address (Polygon Network)
                  </label>
                  <Input
                    value={formData.wallet_address}
                    onChange={(e) => setFormData(prev => ({ ...prev, wallet_address: e.target.value }))}
                    placeholder="0x... (optional - you can add this later)"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    You can skip this step and connect your wallet later from your profile settings.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  How It Works
                </h3>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-5 border-l-4 border-primary">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">1. Browse Opportunities</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Explore equipment financing opportunities from verified hospitals across Africa.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-5 border-l-4 border-primary">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">2. Invest Securely</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Smart contracts ensure transparent terms and automatic ROI distribution.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-5 border-l-4 border-primary">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Coins className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">3. Earn Returns</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Receive competitive returns while helping improve healthcare access in Africa.
                        </p>
                      </div>
                    </div>
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
                  {loading ? "Setting up..." : "Start Investing"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestorOnboardingForm;
