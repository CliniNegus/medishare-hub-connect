import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useAuditLogger } from '@/hooks/useAuditLogger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Mail,
  Globe,
  CreditCard,
  Calendar,
  FileText,
  Package,
  DollarSign,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

interface ManufacturerOnboarding {
  id: string;
  user_id: string;
  company_name: string | null;
  shop_name: string | null;
  status: string | null;
  business_models: string[] | null;
  submitted_at: string | null;
  created_at: string | null;
  contact_email: string | null;
  country: string | null;
  credit_limit: number | null;
  payment_cycle: number | null;
  billing_basis: string | null;
  returns_policy: string | null;
  usage_policy: string | null;
  direct_payment_terms: string | null;
  product_categories: string[] | null;
  shop_description: string | null;
  shop_logo_url: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

interface Props {
  submission: ManufacturerOnboarding;
  onBack: () => void;
  onUpdate: () => void;
}

const ManufacturerApprovalDetail: React.FC<Props> = ({ submission, onBack, onUpdate }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logAuditEvent } = useAuditLogger();
  
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleApprove = async () => {
    if (!user) return;
    
    try {
      setProcessing(true);

      // Update manufacturer onboarding status
      const { error: updateError } = await supabase
        .from('manufacturer_onboarding')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq('id', submission.id);

      if (updateError) throw updateError;

      // Log audit event
      await logAuditEvent(
        'MANUFACTURER_APPROVED',
        'manufacturer_onboarding',
        submission.id,
        { status: submission.status },
        { status: 'approved', reviewed_by: user.id }
      );

      // Send notification to manufacturer
      await supabase.from('notifications').insert({
        user_id: submission.user_id,
        title: 'Application Approved',
        message: 'Congratulations! Your manufacturer application has been approved. You can now start adding products and receiving orders.',
        type: 'success',
        action_url: '/dashboard',
      });

      toast({
        title: 'Manufacturer Approved',
        description: `${submission.company_name || 'Manufacturer'} has been approved successfully.`,
      });

      setShowApproveDialog(false);
      onUpdate();
    } catch (error) {
      console.error('Error approving manufacturer:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve manufacturer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!user || !rejectionReason.trim()) {
      toast({
        title: 'Reason Required',
        description: 'Please provide a reason for rejection.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setProcessing(true);

      // Update manufacturer onboarding status
      const { error: updateError } = await supabase
        .from('manufacturer_onboarding')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq('id', submission.id);

      if (updateError) throw updateError;

      // Log audit event with rejection reason
      await logAuditEvent(
        'MANUFACTURER_REJECTED',
        'manufacturer_onboarding',
        submission.id,
        { status: submission.status },
        { status: 'rejected', reviewed_by: user.id, rejection_reason: rejectionReason }
      );

      // Send notification to manufacturer with feedback
      await supabase.from('notifications').insert({
        user_id: submission.user_id,
        title: 'Application Requires Changes',
        message: `Your manufacturer application needs revisions: ${rejectionReason}. Please update your submission and resubmit.`,
        type: 'warning',
        action_url: '/manufacturer/onboarding',
      });

      toast({
        title: 'Manufacturer Rejected',
        description: 'The manufacturer has been notified and can make corrections.',
      });

      setShowRejectDialog(false);
      setRejectionReason('');
      onUpdate();
    } catch (error) {
      console.error('Error rejecting manufacturer:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject manufacturer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-sm px-3 py-1">
            <Clock className="h-4 w-4 mr-1" />
            Pending Review
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 text-sm px-3 py-1">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 text-sm px-3 py-1">
            <XCircle className="h-4 w-4 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <FileText className="h-4 w-4 mr-1" />
            Draft
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatBusinessModel = (model: string) => {
    return model
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const isPending = submission.status === 'pending';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          {getStatusBadge(submission.status)}
        </div>
        
        {isPending && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => setShowRejectDialog(true)}
              disabled={processing}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setShowApproveDialog(true)}
              disabled={processing}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
        )}
      </div>

      {/* Company Information */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#E02020]" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground text-sm">Company Name</Label>
              <p className="font-medium text-[#333333]">{submission.company_name || '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Shop Name</Label>
              <p className="font-medium text-[#333333]">{submission.shop_name || '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Shop Description</Label>
              <p className="text-[#333333]">{submission.shop_description || '-'}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label className="text-muted-foreground text-sm">Contact Email</Label>
                <p className="font-medium text-[#333333]">{submission.contact_email || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label className="text-muted-foreground text-sm">Country</Label>
                <p className="font-medium text-[#333333]">{submission.country || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label className="text-muted-foreground text-sm">Product Categories</Label>
                <p className="font-medium text-[#333333]">
                  {submission.product_categories?.join(', ') || '-'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Models */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-[#E02020]" />
            Selected Business Models
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submission.business_models && submission.business_models.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {submission.business_models.map((model) => (
                <Badge
                  key={model}
                  variant="outline"
                  className="bg-[#E02020]/5 border-[#E02020]/20 text-[#333333] px-3 py-1"
                >
                  {formatBusinessModel(model)}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No business models selected</p>
          )}
        </CardContent>
      </Card>

      {/* Commercial Terms */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-[#E02020]" />
            Commercial Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-[#E02020]" />
              <Label className="text-muted-foreground text-sm">Credit Limit</Label>
            </div>
            <p className="font-semibold text-lg text-[#333333]">
              {formatCurrency(submission.credit_limit)}
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-[#E02020]" />
              <Label className="text-muted-foreground text-sm">Payment Cycle</Label>
            </div>
            <p className="font-semibold text-lg text-[#333333]">
              {submission.payment_cycle ? `${submission.payment_cycle} days` : '-'}
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="h-4 w-4 text-[#E02020]" />
              <Label className="text-muted-foreground text-sm">Billing Basis</Label>
            </div>
            <p className="font-semibold text-lg text-[#333333] capitalize">
              {submission.billing_basis || '-'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Policies */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#E02020]" />
            Policies & Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-muted-foreground text-sm">Returns & DOA Policy</Label>
            <p className="mt-1 p-3 bg-gray-50 rounded-lg text-[#333333]">
              {submission.returns_policy || 'No policy specified'}
            </p>
          </div>
          
          <div>
            <Label className="text-muted-foreground text-sm">Usage Policy</Label>
            <p className="mt-1 p-3 bg-gray-50 rounded-lg text-[#333333]">
              {submission.usage_policy || 'No policy specified'}
            </p>
          </div>
          
          <div>
            <Label className="text-muted-foreground text-sm">Direct Payment Terms</Label>
            <p className="mt-1 p-3 bg-gray-50 rounded-lg text-[#333333]">
              {submission.direct_payment_terms || 'No terms specified'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submission Metadata */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#E02020]" />
            Submission Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-muted-foreground text-sm">Created At</Label>
            <p className="font-medium text-[#333333]">{formatDate(submission.created_at)}</p>
          </div>
          <div>
            <Label className="text-muted-foreground text-sm">Submitted At</Label>
            <p className="font-medium text-[#333333]">{formatDate(submission.submitted_at)}</p>
          </div>
          {submission.reviewed_at && (
            <div>
              <Label className="text-muted-foreground text-sm">Reviewed At</Label>
              <p className="font-medium text-[#333333]">{formatDate(submission.reviewed_at)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Approve Manufacturer
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve <strong>{submission.company_name}</strong>?
              This will:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Activate their selected business models</li>
                <li>Allow them to add products and receive orders</li>
                <li>Lock their commercial terms from editing</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              disabled={processing}
              className="bg-green-600 hover:bg-green-700"
            >
              {processing ? 'Processing...' : 'Confirm Approval'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Reject Manufacturer Application
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejection. This feedback will be sent to the manufacturer
              so they can make corrections.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="rejection-reason">Rejection Reason (Required)</Label>
            <Textarea
              id="rejection-reason"
              placeholder="Please explain what needs to be corrected..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={processing || !rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {processing ? 'Processing...' : 'Confirm Rejection'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManufacturerApprovalDetail;
