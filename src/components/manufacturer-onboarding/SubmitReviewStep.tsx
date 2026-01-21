import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Store, 
  Package, 
  CreditCard, 
  FileText, 
  CheckCircle, 
  Lock,
  Clock,
  XCircle,
  RefreshCcw,
  ShoppingCart
} from 'lucide-react';
import { BusinessModelType } from './BusinessModelSelector';

interface OnboardingData {
  company_name: string;
  country: string;
  contact_email: string;
  contact_phone: string;
  product_categories: string[];
  shop_name: string;
  shop_description: string;
  business_models: BusinessModelType[];
  // Commercial Terms
  credit_limit: number | null;
  payment_cycle: 30 | 60 | 90 | null;
  returns_policy: string;
  billing_basis: string;
  usage_policy: string;
  maintenance_responsibility: 'manufacturer' | 'shared' | null;
  direct_payment_terms: 'prepaid' | 'net_30' | 'net_60' | null;
}

interface SubmitReviewStepProps {
  data: OnboardingData;
  status: string;
  isConfirmed: boolean;
  onConfirmChange: (confirmed: boolean) => void;
  rejectionReason?: string;
  submittedAt?: string;
}

const SubmitReviewStep: React.FC<SubmitReviewStepProps> = ({
  data,
  status,
  isConfirmed,
  onConfirmChange,
  rejectionReason,
  submittedAt,
}) => {
  const getBusinessModelLabel = (model: BusinessModelType): string => {
    switch (model) {
      case 'consignment': return 'Consignment / Credit Stock';
      case 'pay_per_use': return 'Pay-per-Use / Leasing';
      case 'direct_purchase': return 'Direct Purchase Orders';
    }
  };

  const getBusinessModelIcon = (model: BusinessModelType) => {
    switch (model) {
      case 'consignment': return <Package className="h-4 w-4" />;
      case 'pay_per_use': return <RefreshCcw className="h-4 w-4" />;
      case 'direct_purchase': return <ShoppingCart className="h-4 w-4" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-muted-foreground/30">
            <FileText className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
    }
  };

  const isReadOnly = status === 'pending' || status === 'approved';

  return (
    <div className="space-y-6">
      {/* Header with Status */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              Step 6
            </Badge>
            Review & Submit
          </h3>
          <p className="text-sm text-muted-foreground">
            Review your setup and submit for admin approval
          </p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Status Alerts */}
      {status === 'pending' && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Clock className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Under Review</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Your application was submitted{submittedAt ? ` on ${new Date(submittedAt).toLocaleDateString()}` : ''} and is currently being reviewed by our team. This typically takes 1-2 business days.
          </AlertDescription>
        </Alert>
      )}

      {status === 'rejected' && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Application Rejected</AlertTitle>
          <AlertDescription>
            {rejectionReason || 'Your application requires changes. Please review and update Steps 4 and 5, then resubmit.'}
          </AlertDescription>
        </Alert>
      )}

      {status === 'approved' && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Approved!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your manufacturer account is fully activated. You can now manage your products and receive orders.
          </AlertDescription>
        </Alert>
      )}

      {/* Lock Notice for Draft */}
      {status === 'draft' && (
        <Alert className="border-amber-200 bg-amber-50">
          <Lock className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Important Notice</AlertTitle>
          <AlertDescription className="text-amber-700">
            Once submitted, these settings cannot be edited until reviewed by an admin. Please review all information carefully before submitting.
          </AlertDescription>
        </Alert>
      )}

      {/* Company Details Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Company Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Company Name</p>
              <p className="font-medium">{data.company_name || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Country</p>
              <p className="font-medium">{data.country || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Contact Email</p>
              <p className="font-medium">{data.contact_email || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Contact Phone</p>
              <p className="font-medium">{data.contact_phone || '-'}</p>
            </div>
            <div className="space-y-1 md:col-span-2">
              <p className="text-muted-foreground">Product Categories</p>
              <div className="flex flex-wrap gap-1">
                {data.product_categories.length > 0 
                  ? data.product_categories.map((cat) => (
                      <Badge key={cat} variant="secondary" className="text-xs">{cat}</Badge>
                    ))
                  : <span className="text-muted-foreground">-</span>
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shop Details Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Virtual Shop</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Shop Name</p>
              <p className="font-medium">{data.shop_name || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Description</p>
              <p className="font-medium line-clamp-2">{data.shop_description || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Models Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Selected Business Models</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {data.business_models.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.business_models.map((model) => (
                <Badge key={model} variant="outline" className="bg-primary/5 text-primary border-primary/30 py-1.5 px-3">
                  {getBusinessModelIcon(model)}
                  <span className="ml-1.5">{getBusinessModelLabel(model)}</span>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No business models selected</p>
          )}
        </CardContent>
      </Card>

      {/* Commercial Terms Sections */}
      {data.business_models.includes('consignment') && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Consignment / Credit Stock Terms</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Credit Limit</p>
                <p className="font-medium">{data.credit_limit ? `$${data.credit_limit.toLocaleString()}` : '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Payment Cycle</p>
                <p className="font-medium">{data.payment_cycle ? `${data.payment_cycle} days` : '-'}</p>
              </div>
              <div className="space-y-1 md:col-span-3">
                <p className="text-muted-foreground">Returns/DOA Policy</p>
                <p className="font-medium">{data.returns_policy || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {data.business_models.includes('pay_per_use') && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <RefreshCcw className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Pay-per-Use / Leasing Terms</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Billing Basis</p>
                <p className="font-medium capitalize">{data.billing_basis || 'Daily'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Maintenance Responsibility</p>
                <p className="font-medium capitalize">{data.maintenance_responsibility || '-'}</p>
              </div>
              <div className="space-y-1 md:col-span-3">
                <p className="text-muted-foreground">Usage Policy</p>
                <p className="font-medium">{data.usage_policy || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {data.business_models.includes('direct_purchase') && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Direct Purchase Terms</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Payment Terms</p>
                <p className="font-medium">
                  {data.direct_payment_terms === 'prepaid' && 'Prepaid (Payment before shipping)'}
                  {data.direct_payment_terms === 'net_30' && 'Net 30 (Payment within 30 days)'}
                  {data.direct_payment_terms === 'net_60' && 'Net 60 (Payment within 60 days)'}
                  {!data.direct_payment_terms && '-'}
                </p>
              </div>
              {data.returns_policy && (
                <div className="space-y-1">
                  <p className="text-muted-foreground">Returns Policy</p>
                  <p className="font-medium">{data.returns_policy}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Confirmation Checkbox - Only for Draft or Rejected */}
      {(status === 'draft' || status === 'rejected') && (
        <div className="flex items-start gap-3 p-4 bg-muted/50 border border-border rounded-lg">
          <Checkbox 
            id="confirm" 
            checked={isConfirmed}
            onCheckedChange={(checked) => onConfirmChange(checked === true)}
          />
          <div className="grid gap-1.5 leading-none">
            <label 
              htmlFor="confirm" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              I confirm that all information provided is accurate
            </label>
            <p className="text-xs text-muted-foreground">
              By checking this box, I agree to CliniBuilds'{' '}
              <a href="/terms-of-service" className="underline hover:text-primary">Terms of Service</a>{' '}
              and <a href="/privacy-policy" className="underline hover:text-primary">Privacy Policy</a>.
            </p>
          </div>
        </div>
      )}

      {/* Read-only notice */}
      {isReadOnly && (
        <div className="flex items-center gap-2 p-3 bg-muted/30 border border-border rounded-lg text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          <span>This application is currently {status === 'pending' ? 'under review' : 'approved'} and cannot be edited.</span>
        </div>
      )}
    </div>
  );
};

export default SubmitReviewStep;
