
import React, { useState } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InventoryItem } from '@/models/inventory';
import { useInventoryActions } from './hooks/useInventoryActions';
import InventoryTableHeader from './components/InventoryTableHeader';
import InventoryTableRow from './components/InventoryTableRow';
import InventoryTableEmpty from './components/InventoryTableEmpty';
import InventoryTableSummary from './components/InventoryTableSummary';

interface InventoryTableProps {
  items: InventoryItem[];
  onViewItem: (id: string) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ items, onViewItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const { handleViewDetails, handleShare } = useInventoryActions();

  const filteredItems = items.filter(item => 
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filter === 'all' || item.category === filter)
  );

  const onViewDetailsWrapper = (item: InventoryItem) => {
    handleViewDetails(item);
    onViewItem(item.id);
  };

  return (
    <div className="space-y-6">
      <InventoryTableHeader
        searchTerm={searchTerm}
        filter={filter}
        onSearchChange={setSearchTerm}
        onFilterChange={setFilter}
      />

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-[#333333]">Item Details</TableHead>
              <TableHead className="font-semibold text-[#333333]">SKU</TableHead>
              <TableHead className="font-semibold text-[#333333]">Category</TableHead>
              <TableHead className="text-center font-semibold text-[#333333]">Stock Status</TableHead>
              <TableHead className="text-center font-semibold text-[#333333]">Available</TableHead>
              <TableHead className="text-right font-semibold text-[#333333]">Price</TableHead>
              <TableHead className="text-right font-semibold text-[#333333]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <InventoryTableEmpty />
            ) : (
              filteredItems.map((item) => (
                <InventoryTableRow
                  key={item.id}
                  item={item}
                  onViewDetails={onViewDetailsWrapper}
                  onShare={handleShare}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {filteredItems.length > 0 && (
        <InventoryTableSummary
          filteredItems={filteredItems}
          totalItems={items.length}
        />
      )}
    </div>
  );
};

export default InventoryTable;
