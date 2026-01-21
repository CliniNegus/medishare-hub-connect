import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import BusinessModelSettings from './BusinessModelSettings';

interface BusinessModelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BusinessModelModal: React.FC<BusinessModelModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Business Model Settings</DialogTitle>
          <DialogDescription>
            Manage which business models you want to offer to hospitals
          </DialogDescription>
        </DialogHeader>
        
        <BusinessModelSettings onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default BusinessModelModal;
