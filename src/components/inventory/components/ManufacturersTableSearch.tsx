
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ManufacturersTableSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalManufacturers: number;
  filteredCount: number;
}

const ManufacturersTableSearch: React.FC<ManufacturersTableSearchProps> = ({
  searchTerm,
  onSearchChange,
  totalManufacturers,
  filteredCount
}) => {
  return (
    <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="relative w-full sm:flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search manufacturers..." 
          className="pl-10 w-full sm:min-w-[300px]" 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="text-sm text-gray-600 text-center sm:text-right">
        {filteredCount} of {totalManufacturers} manufacturers
      </div>
    </div>
  );
};

export default ManufacturersTableSearch;
