
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface InventoryTableHeaderProps {
  searchTerm: string;
  filter: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

const InventoryTableHeader: React.FC<InventoryTableHeaderProps> = ({
  searchTerm,
  filter,
  onSearchChange,
  onFilterChange
}) => {
  const categories = ['all', 'imaging', 'surgical', 'respiratory', 'monitoring', 'diagnostic'];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="relative w-full sm:w-auto flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search by name, SKU, or manufacturer..." 
          className="pl-10 min-w-[300px]" 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-3 w-full sm:w-auto">
        <select 
          className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-[#E02020] focus:border-transparent"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
        <Button variant="outline" size="icon" className="border-[#E02020] text-[#E02020] hover:bg-red-50">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default InventoryTableHeader;
