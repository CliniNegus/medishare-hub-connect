import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Building, TrendingUp, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type VisibilityStatus = 'hidden' | 'visible_all' | 'visible_hospitals' | 'visible_investors';

interface VisibilityControlProps {
  itemId: string;
  itemType: 'equipment' | 'product';
  currentVisibility: VisibilityStatus | string | null;
  itemName: string;
  onVisibilityChange?: (newVisibility: VisibilityStatus) => void;
  disabled?: boolean;
  compact?: boolean;
}

const visibilityOptions: { value: VisibilityStatus; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'hidden', label: 'Hidden', icon: EyeOff, color: 'bg-gray-100 text-gray-800' },
  { value: 'visible_all', label: 'Visible to All', icon: Globe, color: 'bg-green-100 text-green-800' },
  { value: 'visible_hospitals', label: 'Hospitals Only', icon: Building, color: 'bg-blue-100 text-blue-800' },
  { value: 'visible_investors', label: 'Investors Only', icon: TrendingUp, color: 'bg-purple-100 text-purple-800' },
];

export const getVisibilityBadgeProps = (visibility: VisibilityStatus) => {
  const option = visibilityOptions.find(o => o.value === visibility) || visibilityOptions[0];
  return {
    label: option.label,
    color: option.color,
    Icon: option.icon,
  };
};

export const VisibilityBadge: React.FC<{ visibility: VisibilityStatus }> = ({ visibility }) => {
  const { label, color, Icon } = getVisibilityBadgeProps(visibility);
  return (
    <Badge className={`${color} flex items-center gap-1`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
};

const VisibilityControl: React.FC<VisibilityControlProps> = ({
  itemId,
  itemType,
  currentVisibility,
  itemName,
  onVisibilityChange,
  disabled = false,
  compact = false,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  
  const normalizedVisibility = (currentVisibility || 'hidden') as VisibilityStatus;

  const handleVisibilityChange = async (newVisibility: VisibilityStatus) => {
    if (newVisibility === normalizedVisibility) return;
    
    setLoading(true);
    try {
      let error: any = null;
      
      if (itemType === 'equipment') {
        const result = await supabase.rpc('update_equipment_visibility', {
          equipment_id: itemId,
          new_visibility: newVisibility,
        });
        error = result.error;
      } else {
        const result = await supabase.rpc('update_product_visibility', {
          product_id: itemId,
          new_visibility: newVisibility,
        });
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: "Visibility Updated",
        description: `${itemName} is now ${visibilityOptions.find(o => o.value === newVisibility)?.label.toLowerCase()}`,
      });

      onVisibilityChange?.(newVisibility);
    } catch (error: any) {
      console.error('Error updating visibility:', error);
      toast({
        title: "Failed to update visibility",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <Select
        value={normalizedVisibility}
        onValueChange={(value) => handleVisibilityChange(value as VisibilityStatus)}
        disabled={disabled || loading}
      >
        <SelectTrigger className="w-40 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {visibilityOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <option.icon className="h-3 w-3" />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Eye className="h-4 w-4" />
        Visibility Settings
      </label>
      <Select
        value={normalizedVisibility}
        onValueChange={(value) => handleVisibilityChange(value as VisibilityStatus)}
        disabled={disabled || loading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select visibility" />
        </SelectTrigger>
        <SelectContent>
          {visibilityOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <option.icon className="h-4 w-4" />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-gray-500">
        {normalizedVisibility === 'hidden' && 'This item is hidden from all non-admin users'}
        {normalizedVisibility === 'visible_all' && 'This item is visible to everyone'}
        {normalizedVisibility === 'visible_hospitals' && 'Only hospitals can see this item'}
        {normalizedVisibility === 'visible_investors' && 'Only investors can see this item'}
      </p>
    </div>
  );
};

export default VisibilityControl;
