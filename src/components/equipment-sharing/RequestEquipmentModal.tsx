import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEquipmentSharing } from '@/hooks/use-equipment-sharing';
import { Loader2 } from 'lucide-react';

interface RequestEquipmentModalProps {
  open: boolean;
  onClose: () => void;
  equipment: {
    id: string;
    name: string;
    owner_id: string;
  };
}

export const RequestEquipmentModal = ({ open, onClose, equipment }: RequestEquipmentModalProps) => {
  const [requestType, setRequestType] = useState<'borrow' | 'lease' | 'purchase'>('borrow');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'normal' | 'high' | 'critical'>('normal');
  const [submitting, setSubmitting] = useState(false);
  
  const { createRequest } = useEquipmentSharing();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await createRequest({
      equipment_id: equipment.id,
      owning_hospital_id: equipment.owner_id,
      request_type: requestType,
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      purpose,
      notes,
      urgency,
    });

    setSubmitting(false);
    if (result.success) {
      onClose();
      // Reset form
      setRequestType('borrow');
      setStartDate('');
      setEndDate('');
      setPurpose('');
      setNotes('');
      setUrgency('normal');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Equipment: {equipment.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Request Type</Label>
            <Select value={requestType} onValueChange={(v: any) => setRequestType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="borrow">Borrow (Temporary Use)</SelectItem>
                <SelectItem value="lease">Lease (Long-term Rental)</SelectItem>
                <SelectItem value="purchase">Purchase Request</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                required
                min={startDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Urgency</Label>
            <Select value={urgency} onValueChange={(v: any) => setUrgency(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Flexible timing</SelectItem>
                <SelectItem value="normal">Normal - Standard request</SelectItem>
                <SelectItem value="high">High - Needed soon</SelectItem>
                <SelectItem value="critical">Critical - Urgent need</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Purpose</Label>
            <Textarea 
              placeholder="Describe why you need this equipment..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Additional Notes</Label>
            <Textarea 
              placeholder="Any special requirements or instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !startDate || !endDate}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
