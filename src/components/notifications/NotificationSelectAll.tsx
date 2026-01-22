import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface NotificationSelectAllProps {
  isAllSelected: boolean;
  isSomeSelected: boolean;
  totalCount: number;
  onSelectAll: () => void;
}

const NotificationSelectAll = ({
  isAllSelected,
  isSomeSelected,
  totalCount,
  onSelectAll,
}: NotificationSelectAllProps) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-muted/30 rounded-lg border border-border mb-4">
      <Checkbox
        checked={isAllSelected}
        onCheckedChange={onSelectAll}
        className="border-muted-foreground/30"
        {...(isSomeSelected && !isAllSelected ? { 'data-state': 'indeterminate' } : {})}
      />
      <span className="text-sm text-muted-foreground">
        {isAllSelected 
          ? `All ${totalCount} notifications selected`
          : `Select all (${totalCount})`
        }
      </span>
    </div>
  );
};

export default NotificationSelectAll;
