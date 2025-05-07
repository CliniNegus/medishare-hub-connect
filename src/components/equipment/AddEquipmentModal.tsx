
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EquipmentForm } from './form/EquipmentForm';
import { EquipmentFormActions } from './form/EquipmentFormActions';
import { useEquipmentForm } from '@/hooks/use-equipment-form';

interface AddEquipmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEquipmentAdded?: () => void;
}

const AddEquipmentModal: React.FC<AddEquipmentModalProps> = ({
  open,
  onOpenChange,
  onEquipmentAdded
}) => {
  const {
    form,
    loading,
    handleChange,
    handleImageUploaded,
    handleSubmit,
    initializeStorage
  } = useEquipmentForm({
    onSuccess: () => {
      onOpenChange(false);
      if (onEquipmentAdded) {
        onEquipmentAdded();
      }
    }
  });

  // Initialize bucket on component mount
  useEffect(() => {
    if (open) {
      initializeStorage();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-[#333333]">Add New Medical Equipment</DialogTitle>
          <DialogDescription>
            Enter the details of the new medical equipment item.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <EquipmentForm 
            form={form}
            handleChange={handleChange}
            handleImageUploaded={handleImageUploaded}
          />
          
          <EquipmentFormActions
            onCancel={() => onOpenChange(false)}
            loading={loading}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEquipmentModal;
