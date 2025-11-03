import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const deletionRequestSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  account_type: z.enum(['hospital', 'manufacturer', 'investor', 'other'], {
    errorMap: () => ({ message: "Please select an account type" })
  }),
  message: z.string().max(1000, "Message must be less than 1000 characters").optional(),
});

type DeletionRequestData = z.infer<typeof deletionRequestSchema>;

const DeleteAccountRequest = () => {
  const [formData, setFormData] = useState<DeletionRequestData>({
    full_name: '',
    email: '',
    account_type: 'hospital',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleInputChange = (field: keyof DeletionRequestData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    try {
      deletionRequestSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        toast({
          title: "Validation Error",
          description: "Please check the form fields and try again.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      // Call edge function to send email notification
      const { error } = await supabase.functions.invoke('send-deletion-request', {
        body: formData
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Request Submitted",
        description: "Your deletion request has been received.",
      });
    } catch (error: any) {
      console.error('Error submitting deletion request:', error);
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again or contact support@clinibuilds.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full shadow-xl">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Request Received</h2>
            <p className="text-muted-foreground mb-6 text-lg">
              Thank you! Your deletion request has been received. Our team will verify your information 
              and delete your account within <strong>7 business days</strong>.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              You will receive a confirmation email at <strong>{formData.email}</strong> once the deletion is complete.
            </p>
            <Button onClick={() => window.location.href = '/'} className="bg-primary hover:bg-primary/90">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-destructive/10 p-4">
              <Trash2 className="h-10 w-10 text-destructive" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Request Account & Data Deletion
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            We respect your right to privacy. You can request permanent deletion of your account and all 
            associated data by filling out this form.
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Deletion Request Form</CardTitle>
            <CardDescription>
              Once we receive your request, our team will verify and remove your information from our 
              systems within 7 business days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-sm font-medium">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  className={errors.full_name ? "border-destructive" : ""}
                  required
                />
                {errors.full_name && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.full_name}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Account Type */}
              <div className="space-y-2">
                <Label htmlFor="account_type" className="text-sm font-medium">
                  Account Type <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.account_type} 
                  onValueChange={(value) => handleInputChange('account_type', value)}
                  required
                >
                  <SelectTrigger className={errors.account_type ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select your account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospital">Hospital</SelectItem>
                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="investor">Investor</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.account_type && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.account_type}
                  </p>
                )}
              </div>

              {/* Optional Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">
                  Reason for Request (Optional)
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us why you're deleting your account (optional)"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className={`min-h-[100px] ${errors.message ? "border-destructive" : ""}`}
                  maxLength={1000}
                />
                {errors.message && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formData.message?.length || 0}/1000 characters
                </p>
              </div>

              <Separator />

              {/* Legal Disclaimer */}
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Important:</strong> By submitting this form, you acknowledge that your account 
                  and related data will be permanently deleted and cannot be recovered once the process 
                  is complete.
                </p>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting Request..." : "Request Deletion"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Support Contact */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              If you have any issues or questions, please contact us at{' '}
              <a 
                href="mailto:support@clinibuilds.com" 
                className="text-primary hover:underline font-medium"
              >
                support@clinibuilds.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeleteAccountRequest;
