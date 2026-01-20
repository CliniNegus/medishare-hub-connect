import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from 'lucide-react';

interface OverwriteConfirmationProps {
  confirmed: boolean;
  onConfirmChange: (confirmed: boolean) => void;
  updateCount: number;
}

const OverwriteConfirmation: React.FC<OverwriteConfirmationProps> = ({
  confirmed,
  onConfirmChange,
  updateCount
}) => {
  if (updateCount === 0) return null;

  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-amber-800">Overwrite Confirmation Required</h4>
            <p className="text-sm text-amber-700 mt-1">
              This action will update <strong>{updateCount}</strong> existing record{updateCount !== 1 ? 's' : ''}. 
              Changes cannot be automatically undone.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="confirmOverwrite" 
              checked={confirmed}
              onCheckedChange={(checked) => onConfirmChange(checked as boolean)}
              className="border-amber-400 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
            />
            <Label htmlFor="confirmOverwrite" className="text-sm text-amber-800 cursor-pointer">
              I understand this action will overwrite existing catalog data and cannot be undone.
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverwriteConfirmation;
