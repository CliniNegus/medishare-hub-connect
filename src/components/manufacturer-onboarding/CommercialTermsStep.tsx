import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Info, Package, RefreshCcw, ShoppingCart, Lock, AlertCircle } from 'lucide-react';
import { BusinessModelType } from './BusinessModelSelector';

export interface CommercialTermsData {
  // Consignment terms
  credit_limit: number | null;
  payment_cycle: 30 | 60 | 90 | null;
  returns_policy: string;
  // Pay-per-use terms
  billing_basis: string;
  usage_policy: string;
  maintenance_responsibility: 'manufacturer' | 'shared' | null;
  // Direct purchase terms
  direct_payment_terms: 'prepaid' | 'net_30' | 'net_60' | null;
}

interface CommercialTermsStepProps {
  selectedBusinessModels: BusinessModelType[];
  termsData: CommercialTermsData;
  onTermsChange: (data: Partial<CommercialTermsData>) => void;
  isReadOnly?: boolean;
  stepNumber?: number;
  errors?: Record<string, string>;
}

const CommercialTermsStep: React.FC<CommercialTermsStepProps> = ({
  selectedBusinessModels,
  termsData,
  onTermsChange,
  isReadOnly = false,
  stepNumber = 5,
  errors = {},
}) => {
  const hasConsignment = selectedBusinessModels.includes('consignment');
  const hasPayPerUse = selectedBusinessModels.includes('pay_per_use');
  const hasDirectPurchase = selectedBusinessModels.includes('direct_purchase');

  const getBusinessModelTitle = (model: BusinessModelType): { title: string; icon: React.ReactNode } => {
    switch (model) {
      case 'consignment':
        return { title: 'Consignment / Credit Stock', icon: <Package className="h-5 w-5" /> };
      case 'pay_per_use':
        return { title: 'Pay-per-Use / Leasing', icon: <RefreshCcw className="h-5 w-5" /> };
      case 'direct_purchase':
        return { title: 'Direct Purchase Orders', icon: <ShoppingCart className="h-5 w-5" /> };
    }
  };

  if (selectedBusinessModels.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Business Models Selected</h3>
        <p className="text-muted-foreground">
          Please go back to Step 4 and select at least one business model before defining commercial terms.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            Step {stepNumber}
          </Badge>
          Define Commercial Terms
          {isReadOnly && (
            <Badge variant="secondary" className="ml-2">
              <Lock className="h-3 w-3 mr-1" />
              Read Only
            </Badge>
          )}
        </h3>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Info className="h-4 w-4" />
          Configure the terms for each of your selected business models.
        </p>
      </div>

      {/* Consignment Terms */}
      {hasConsignment && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                {getBusinessModelTitle('consignment').icon}
              </div>
              <div>
                <CardTitle className="text-base">{getBusinessModelTitle('consignment').title}</CardTitle>
                <CardDescription>Define credit and payment terms for consignment sales</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="credit_limit" className="flex items-center gap-1">
                  Credit Limit (USD) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="credit_limit"
                  type="number"
                  min={0}
                  value={termsData.credit_limit || ''}
                  onChange={(e) => onTermsChange({ credit_limit: Number(e.target.value) || null })}
                  placeholder="e.g., 500000"
                  disabled={isReadOnly}
                  className={errors.credit_limit ? 'border-destructive' : ''}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum credit you can extend to hospitals
                </p>
                {errors.credit_limit && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.credit_limit}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_cycle" className="flex items-center gap-1">
                  Payment Cycle <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={termsData.payment_cycle?.toString() || ''}
                  onValueChange={(value) => onTermsChange({ payment_cycle: Number(value) as 30 | 60 | 90 })}
                  disabled={isReadOnly}
                >
                  <SelectTrigger className={errors.payment_cycle ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select payment cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Time allowed for hospital to pay after usage
                </p>
                {errors.payment_cycle && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.payment_cycle}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="returns_policy" className="flex items-center gap-1">
                Returns / DOA Policy <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="returns_policy"
                value={termsData.returns_policy}
                onChange={(e) => onTermsChange({ returns_policy: e.target.value })}
                placeholder="Describe your return policy, DOA handling, and warranty terms..."
                rows={3}
                disabled={isReadOnly}
                className={errors.returns_policy ? 'border-destructive' : ''}
              />
              <p className="text-xs text-muted-foreground">
                Define how returns and defective items are handled
              </p>
              {errors.returns_policy && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.returns_policy}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pay-per-Use Terms */}
      {hasPayPerUse && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                {getBusinessModelTitle('pay_per_use').icon}
              </div>
              <div>
                <CardTitle className="text-base">{getBusinessModelTitle('pay_per_use').title}</CardTitle>
                <CardDescription>Define usage-based billing and maintenance terms</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billing_basis" className="flex items-center gap-1">
                  Billing Basis <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={termsData.billing_basis || 'daily'}
                  onValueChange={(value) => onTermsChange({ billing_basis: value })}
                  disabled={true} // Daily is enforced
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select billing basis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Daily billing is the default and enforced option
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenance_responsibility" className="flex items-center gap-1">
                  Maintenance Responsibility <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={termsData.maintenance_responsibility || ''}
                  onValueChange={(value) => onTermsChange({ maintenance_responsibility: value as 'manufacturer' | 'shared' })}
                  disabled={isReadOnly}
                >
                  <SelectTrigger className={errors.maintenance_responsibility ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select who handles maintenance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="shared">Shared</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Who is responsible for equipment maintenance
                </p>
                {errors.maintenance_responsibility && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.maintenance_responsibility}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="usage_policy" className="flex items-center gap-1">
                Usage Policy <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="usage_policy"
                value={termsData.usage_policy}
                onChange={(e) => onTermsChange({ usage_policy: e.target.value })}
                placeholder="Describe usage terms, restrictions, and billing calculation method..."
                rows={3}
                disabled={isReadOnly}
                className={errors.usage_policy ? 'border-destructive' : ''}
              />
              <p className="text-xs text-muted-foreground">
                Define how usage is tracked and billed
              </p>
              {errors.usage_policy && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.usage_policy}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Direct Purchase Terms */}
      {hasDirectPurchase && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                {getBusinessModelTitle('direct_purchase').icon}
              </div>
              <div>
                <CardTitle className="text-base">{getBusinessModelTitle('direct_purchase').title}</CardTitle>
                <CardDescription>Define payment and return terms for direct purchases</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="direct_payment_terms" className="flex items-center gap-1">
                Payment Terms <span className="text-destructive">*</span>
              </Label>
              <Select
                value={termsData.direct_payment_terms || ''}
                onValueChange={(value) => onTermsChange({ direct_payment_terms: value as 'prepaid' | 'net_30' | 'net_60' })}
                disabled={isReadOnly}
              >
                <SelectTrigger className={errors.direct_payment_terms ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prepaid">Prepaid (Payment before shipping)</SelectItem>
                  <SelectItem value="net_30">Net 30 (Payment within 30 days)</SelectItem>
                  <SelectItem value="net_60">Net 60 (Payment within 60 days)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                When payment is expected for direct purchases
              </p>
              {errors.direct_payment_terms && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.direct_payment_terms}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="direct_returns_policy">
                Returns Policy <span className="text-muted-foreground">(Optional but recommended)</span>
              </Label>
              <Textarea
                id="direct_returns_policy"
                value={termsData.returns_policy}
                onChange={(e) => onTermsChange({ returns_policy: e.target.value })}
                placeholder="Describe your return policy for direct purchases..."
                rows={3}
                disabled={isReadOnly}
              />
              <p className="text-xs text-muted-foreground">
                Define return conditions for direct purchase orders
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommercialTermsStep;
