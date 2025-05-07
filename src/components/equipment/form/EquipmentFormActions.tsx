
import React from 'react';
import { Button } from "@/components/ui/button";

interface EquipmentFormActionsProps {
  onCancel: () => void;
  loading: boolean;
}

export const EquipmentFormActions: React.FC<EquipmentFormActionsProps> = ({
  onCancel,
  loading
}) => {
  return (
    <div className="flex justify-end space-x-4 mt-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={loading}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={loading}
        className="bg-[#E02020] hover:bg-[#E02020]/90 text-white"
      >
        {loading ? 'Adding Equipment...' : 'Add Equipment'}
      </Button>
    </div>
  );
};
