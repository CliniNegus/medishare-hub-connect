import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { DollarSign, Send, Loader2 } from 'lucide-react';
import { ClusterMapCluster } from '@/data/clusterMapDemoData';

interface ExpressInterestModalProps {
  cluster: ClusterMapCluster | null;
  open: boolean;
  onClose: () => void;
}

const INVESTMENT_RANGES = [
  { value: '5k-25k', label: '$5,000 - $25,000' },
  { value: '25k-100k', label: '$25,000 - $100,000' },
  { value: '100k+', label: '$100,000+' },
];

const ExpressInterestModal: React.FC<ExpressInterestModalProps> = ({
  cluster,
  open,
  onClose,
}) => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.full_name || '',
    email: user?.email || '',
    investmentRange: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.investmentRange) {
      toast({
        title: 'Investment range required',
        description: 'Please select an investment range to continue.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock action - in production, this would save to a database
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Interest Expressed Successfully!',
        description: `Your interest in ${cluster?.name} has been recorded. Our team will contact you soon.`,
        duration: 5000,
      });

      onClose();
      setFormData({
        name: profile?.full_name || '',
        email: user?.email || '',
        investmentRange: '',
        notes: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit your interest. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Express Investment Interest
          </DialogTitle>
          <DialogDescription>
            {cluster ? `Invest in ${cluster.name}` : 'Loading...'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="investmentRange">Investment Range</Label>
            <Select
              value={formData.investmentRange}
              onValueChange={(value) => setFormData(prev => ({ ...prev, investmentRange: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select investment range" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {INVESTMENT_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any specific questions or requirements..."
              rows={3}
            />
          </div>

          {cluster && (
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <div className="font-medium mb-1">Investment Summary</div>
              <div className="text-muted-foreground space-y-0.5">
                <div>Cluster: {cluster.name}</div>
                <div>Capital Needed: ${cluster.investor_capital_needed.toLocaleString()}</div>
                <div>Est. Monthly Return: ${cluster.projected_monthly_return.toLocaleString()}</div>
                <div>Payback Period: {cluster.payback_months} months</div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Express Interest
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpressInterestModal;
