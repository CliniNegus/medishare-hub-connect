
import React from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ShopFiltersProps {
  searchTerm: string;
  category: string;
  productType: string;
  uniqueCategories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onProductTypeChange: (value: string) => void;
}

const ShopFilters = ({
  searchTerm,
  category,
  productType,
  uniqueCategories,
  onSearchChange,
  onCategoryChange,
  onProductTypeChange
}: ShopFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex gap-2">
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {uniqueCategories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={productType} onValueChange={onProductTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Product Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="disposable">Disposable</SelectItem>
            <SelectItem value="reusable">Reusable</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ShopFilters;
