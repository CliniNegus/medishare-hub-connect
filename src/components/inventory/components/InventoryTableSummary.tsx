
import React from 'react';
import { InventoryItem } from '@/models/inventory';

interface InventoryTableSummaryProps {
  filteredItems: InventoryItem[];
  totalItems: number;
}

const InventoryTableSummary: React.FC<InventoryTableSummaryProps> = ({
  filteredItems,
  totalItems
}) => {
  const totalValue = filteredItems.reduce((sum, item) => sum + (item.price * item.currentStock), 0);

  return (
    <div className="flex items-center justify-between text-sm text-gray-600 px-2">
      <span>
        Showing {filteredItems.length} of {totalItems} items
      </span>
      <span>
        Total value: Ksh {totalValue.toLocaleString()}
      </span>
    </div>
  );
};

export default InventoryTableSummary;
