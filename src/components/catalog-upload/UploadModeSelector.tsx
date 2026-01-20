import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, RefreshCw, AlertTriangle } from 'lucide-react';
import { UploadMode } from './types';

interface UploadModeSelectorProps {
  mode: UploadMode;
  onModeChange: (mode: UploadMode) => void;
  allowNewInUpdateMode: boolean;
  onAllowNewChange: (allow: boolean) => void;
}

const UploadModeSelector: React.FC<UploadModeSelectorProps> = ({
  mode,
  onModeChange,
  allowNewInUpdateMode,
  onAllowNewChange
}) => {
  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
      <div className="flex items-center gap-2 text-sm font-medium">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <span>Select Upload Mode</span>
      </div>
      
      <RadioGroup value={mode} onValueChange={(v) => onModeChange(v as UploadMode)} className="space-y-3">
        <div className="flex items-start space-x-3 p-3 rounded-md border bg-background hover:bg-accent/50 transition-colors">
          <RadioGroupItem value="add" id="add" className="mt-0.5" />
          <Label htmlFor="add" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-green-600" />
              <span className="font-medium">Add New Items</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Inserts only new records. Existing items with matching identifiers will be skipped.
            </p>
          </Label>
        </div>
        
        <div className="flex items-start space-x-3 p-3 rounded-md border bg-background hover:bg-accent/50 transition-colors">
          <RadioGroupItem value="update" id="update" className="mt-0.5" />
          <Label htmlFor="update" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Update Existing Catalog</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Updates existing records that match by name/SKU. New items will be shown but not created unless allowed.
            </p>
          </Label>
        </div>
      </RadioGroup>

      {mode === 'update' && (
        <div className="flex items-center space-x-2 pl-6 pt-2 border-t mt-3">
          <Checkbox 
            id="allowNew" 
            checked={allowNewInUpdateMode}
            onCheckedChange={(checked) => onAllowNewChange(checked as boolean)}
          />
          <Label htmlFor="allowNew" className="text-sm cursor-pointer">
            Also create new items that don't exist yet
          </Label>
        </div>
      )}
    </div>
  );
};

export default UploadModeSelector;
