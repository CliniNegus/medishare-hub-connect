import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Store, 
  Package, 
  CreditCard, 
  FileText, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Upload,
  Download
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Company Details', icon: Building2 },
  { id: 2, title: 'Virtual Shop', icon: Store },
  { id: 3, title: 'Catalog Setup', icon: Package },
  { id: 4, title: 'Business Model', icon: CreditCard },
  { id: 5, title: 'Terms', icon: FileText },
  { id: 6, title: 'Review & Submit', icon: CheckCircle },
];

const PRODUCT_CATEGORIES = [
  'Diagnostic Equipment',
  'Imaging Systems',
  'Surgical Instruments',
  'Patient Monitoring',
  'Laboratory Equipment',
  'Rehabilitation Equipment',
  'Dental Equipment',
  'Consumables & Disposables',
];

const COUNTRIES = [
  'Germany',
  'United States',
  'United Kingdom',
  'France',
  'Nigeria',
  'South Africa',
  'Kenya',
  'India',
  'Japan',
  'China',
  'Other',
];

interface OnboardingData {
  company_name: string;
  country: string;
  contact_email: string;
  contact_phone: string;
  product_categories: string[];
  shop_name: string;
  shop_description: string;
  shop_logo_url: string;
  catalog_file_url: string;
  business_model: 'consignment' | 'pay_per_use' | 'direct_purchase' | null;
  credit_limit: number | null;
  payment_cycle: 30 | 60 | 90 | null;
  returns_policy: string;
}

const ManufacturerOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [onboardingId, setOnboardingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('draft');
  
  const [data, setData] = useState<OnboardingData>({
    company_name: profile?.organization || '',
    country: '',
    contact_email: profile?.email || '',
    contact_phone: profile?.phone || '',
    product_categories: [],
    shop_name: '',
    shop_description: '',
    shop_logo_url: '',
    catalog_file_url: '',
    business_model: null,
    credit_limit: null,
    payment_cycle: null,
    returns_policy: '',
  });

  useEffect(() => {
    if (user) {
      loadExistingOnboarding();
    }
  }, [user]);

  const loadExistingOnboarding = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: existing, error } = await supabase
        .from('manufacturer_onboarding')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (existing) {
        setOnboardingId(existing.id);
        setCurrentStep(existing.current_step || 1);
        setStatus(existing.status || 'draft');
        setData({
          company_name: existing.company_name || '',
          country: existing.country || '',
          contact_email: existing.contact_email || '',
          contact_phone: existing.contact_phone || '',
          product_categories: existing.product_categories || [],
          shop_name: existing.shop_name || '',
          shop_description: existing.shop_description || '',
          shop_logo_url: existing.shop_logo_url || '',
          catalog_file_url: existing.catalog_file_url || '',
          business_model: existing.business_model as OnboardingData['business_model'],
          credit_limit: existing.credit_limit,
          payment_cycle: existing.payment_cycle as OnboardingData['payment_cycle'],
          returns_policy: existing.returns_policy || '',
        });
      }
    } catch (error: any) {
      console.error('Error loading onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (step: number) => {
    if (!user) return;
    
    try {
      const payload = {
        user_id: user.id,
        current_step: step,
        ...data,
        updated_at: new Date().toISOString(),
      };

      if (onboardingId) {
        const { error } = await supabase
          .from('manufacturer_onboarding')
          .update(payload)
          .eq('id', onboardingId);
        
        if (error) throw error;
      } else {
        const { data: newRecord, error } = await supabase
          .from('manufacturer_onboarding')
          .insert(payload)
          .select()
          .single();
        
        if (error) throw error;
        if (newRecord) setOnboardingId(newRecord.id);
      }
    } catch (error: any) {
      console.error('Error saving progress:', error);
    }
  };

  const handleNext = async () => {
    if (currentStep < 6) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      await saveProgress(nextStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user || !onboardingId) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('manufacturer_onboarding')
        .update({
          status: 'pending',
          submitted_at: new Date().toISOString(),
          current_step: 6,
        })
        .eq('id', onboardingId);

      if (error) throw error;

      setStatus('pending');
      toast({
        title: 'Onboarding submitted!',
        description: 'Your application is now under review. We\'ll notify you once approved.',
      });
    } catch (error: any) {
      toast({
        title: 'Submission failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setData(prev => ({
      ...prev,
      product_categories: prev.product_categories.includes(category)
        ? prev.product_categories.filter(c => c !== category)
        : [...prev.product_categories, category]
    }));
  };

  const progress = (currentStep / 6) * 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#E02020]" />
      </div>
    );
  }

  if (status === 'pending' || status === 'approved') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                status === 'approved' ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                <CheckCircle className={`h-8 w-8 ${
                  status === 'approved' ? 'text-green-600' : 'text-yellow-600'
                }`} />
              </div>
              <h2 className="text-2xl font-bold text-[#333333] mb-2">
                {status === 'approved' ? 'Onboarding Approved!' : 'Under Review'}
              </h2>
              <p className="text-gray-600 mb-6">
                {status === 'approved' 
                  ? 'Your manufacturer account is now fully activated. You can start managing your products and orders.'
                  : 'Your application is being reviewed by our team. This typically takes 1-2 business days.'
                }
              </p>
              <Button onClick={() => navigate('/dashboard')} className="bg-[#E02020] hover:bg-[#c01c1c]">
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-[#333333] mb-2">Manufacturer Onboarding</h1>
          <p className="text-gray-600">Complete your profile to start selling on CliniBuilds</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step {currentStep} of 6</span>
            <span className="text-sm font-medium text-[#E02020]">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isComplete = currentStep > step.id;
              
              return (
                <div 
                  key={step.id}
                  className={`flex flex-col items-center ${
                    isActive ? 'text-[#E02020]' : isComplete ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isActive ? 'border-[#E02020] bg-red-50' : 
                    isComplete ? 'border-green-600 bg-green-50' : 'border-gray-300'
                  }`}>
                    {isComplete ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span className="text-xs mt-1 hidden md:block">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Tell us about your company'}
              {currentStep === 2 && 'Set up your virtual storefront'}
              {currentStep === 3 && 'Add your product catalog'}
              {currentStep === 4 && 'Choose how you want to sell'}
              {currentStep === 5 && 'Define your business terms'}
              {currentStep === 6 && 'Review and submit your application'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Company Details */}
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_name">Company Name *</Label>
                    <Input
                      id="company_name"
                      value={data.company_name}
                      onChange={(e) => setData({ ...data, company_name: e.target.value })}
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Select 
                      value={data.country} 
                      onValueChange={(value) => setData({ ...data, country: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_email">Contact Email *</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={data.contact_email}
                      onChange={(e) => setData({ ...data, contact_email: e.target.value })}
                      placeholder="contact@company.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_phone">Contact Phone *</Label>
                    <Input
                      id="contact_phone"
                      type="tel"
                      value={data.contact_phone}
                      onChange={(e) => setData({ ...data, contact_phone: e.target.value })}
                      placeholder="+49 123 456 7890"
                    />
                  </div>
                </div>
                <div>
                  <Label className="mb-3 block">Product Categories *</Label>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCT_CATEGORIES.map((category) => (
                      <Badge
                        key={category}
                        variant={data.product_categories.includes(category) ? 'default' : 'outline'}
                        className={`cursor-pointer transition-all ${
                          data.product_categories.includes(category) 
                            ? 'bg-[#E02020] hover:bg-[#c01c1c]' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => handleCategoryToggle(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Virtual Shop */}
            {currentStep === 2 && (
              <>
                <div>
                  <Label htmlFor="shop_name">Shop Name *</Label>
                  <Input
                    id="shop_name"
                    value={data.shop_name}
                    onChange={(e) => setData({ ...data, shop_name: e.target.value })}
                    placeholder="e.g., MedTech Solutions Store"
                  />
                </div>
                <div>
                  <Label htmlFor="shop_description">Shop Description</Label>
                  <Textarea
                    id="shop_description"
                    value={data.shop_description}
                    onChange={(e) => setData({ ...data, shop_description: e.target.value })}
                    placeholder="Tell hospitals about your products and services..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Shop Logo</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#E02020] transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Catalog Setup */}
            {currentStep === 3 && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-800 mb-2">Bulk Upload</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Upload a CSV file with your product catalog for quick setup.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-blue-300 text-blue-700">
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                    <Button variant="outline" size="sm" className="border-blue-300 text-blue-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload CSV
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-6 text-center">
                  <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h4 className="font-medium text-[#333333] mb-2">Or Add Products Manually</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    You can add products one by one after completing onboarding
                  </p>
                  <Button variant="outline" disabled>
                    Add Product (Available after approval)
                  </Button>
                </div>
              </>
            )}

            {/* Step 4: Business Model */}
            {currentStep === 4 && (
              <div className="space-y-4">
                {[
                  {
                    id: 'consignment' as const,
                    title: 'Consignment / Credit Stock',
                    description: 'Hospital pays only when equipment is used. Ideal for high-value equipment with variable usage.',
                  },
                  {
                    id: 'pay_per_use' as const,
                    title: 'Pay-per-use / Leasing',
                    description: 'Hospitals pay based on usage or monthly lease. Great for recurring revenue.',
                  },
                  {
                    id: 'direct_purchase' as const,
                    title: 'Direct Purchase Orders',
                    description: 'Traditional sales model. Hospital pays upfront or on delivery.',
                  },
                ].map((model) => (
                  <div
                    key={model.id}
                    onClick={() => setData({ ...data, business_model: model.id })}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      data.business_model === model.id
                        ? 'border-[#E02020] bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        data.business_model === model.id ? 'border-[#E02020]' : 'border-gray-300'
                      }`}>
                        {data.business_model === model.id && (
                          <div className="w-3 h-3 rounded-full bg-[#E02020]" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-[#333333]">{model.title}</h4>
                        <p className="text-sm text-gray-600">{model.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 5: Terms */}
            {currentStep === 5 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="credit_limit">Credit Limit (USD)</Label>
                    <Input
                      id="credit_limit"
                      type="number"
                      value={data.credit_limit || ''}
                      onChange={(e) => setData({ ...data, credit_limit: Number(e.target.value) || null })}
                      placeholder="e.g., 500000"
                    />
                    <p className="text-xs text-gray-500 mt-1">Maximum credit you can extend to hospitals</p>
                  </div>
                  <div>
                    <Label htmlFor="payment_cycle">Payment Cycle</Label>
                    <Select 
                      value={data.payment_cycle?.toString() || ''} 
                      onValueChange={(value) => setData({ ...data, payment_cycle: Number(value) as 30 | 60 | 90 })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment cycle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">Net 30 days</SelectItem>
                        <SelectItem value="60">Net 60 days</SelectItem>
                        <SelectItem value="90">Net 90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="returns_policy">Returns & DOA Policy</Label>
                  <Textarea
                    id="returns_policy"
                    value={data.returns_policy}
                    onChange={(e) => setData({ ...data, returns_policy: e.target.value })}
                    placeholder="Describe your return policy, DOA handling, and warranty terms..."
                    rows={4}
                  />
                </div>
              </>
            )}

            {/* Step 6: Review */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-[#333333] mb-3">Company Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-600">Company:</span>
                    <span className="font-medium">{data.company_name || '-'}</span>
                    <span className="text-gray-600">Country:</span>
                    <span className="font-medium">{data.country || '-'}</span>
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{data.contact_email || '-'}</span>
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{data.contact_phone || '-'}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-[#333333] mb-3">Shop Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-600">Shop Name:</span>
                    <span className="font-medium">{data.shop_name || '-'}</span>
                    <span className="text-gray-600">Categories:</span>
                    <span className="font-medium">{data.product_categories.join(', ') || '-'}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-[#333333] mb-3">Business Terms</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-600">Business Model:</span>
                    <span className="font-medium capitalize">{data.business_model?.replace('_', ' ') || '-'}</span>
                    <span className="text-gray-600">Credit Limit:</span>
                    <span className="font-medium">{data.credit_limit ? `$${data.credit_limit.toLocaleString()}` : '-'}</span>
                    <span className="text-gray-600">Payment Cycle:</span>
                    <span className="font-medium">{data.payment_cycle ? `Net ${data.payment_cycle} days` : '-'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Checkbox id="confirm" />
                  <label htmlFor="confirm" className="text-sm text-yellow-800">
                    I confirm that all information provided is accurate and I agree to CliniBuilds' 
                    <a href="/terms-of-service" className="underline ml-1">Terms of Service</a> and 
                    <a href="/privacy-policy" className="underline ml-1">Privacy Policy</a>.
                  </label>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          {currentStep < 6 ? (
            <Button onClick={handleNext} className="bg-[#E02020] hover:bg-[#c01c1c]">
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={submitting}
              className="bg-[#E02020] hover:bg-[#c01c1c]"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit for Review
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManufacturerOnboarding;
