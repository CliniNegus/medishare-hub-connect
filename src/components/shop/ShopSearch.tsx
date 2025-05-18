
import React from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: number;
  name: string;
  count: number;
}

interface ShopSearchProps {
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const ShopSearch = ({ categories, onSearchChange, onCategoryChange }: ShopSearchProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search products and medical supplies..."
          className="pl-10 bg-gray-50"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Categories</h3>
        <div className="flex flex-wrap gap-2">
          <Badge 
            onClick={() => onCategoryChange('')}
            className="cursor-pointer bg-red-600 hover:bg-red-700"
          >
            All
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant="outline"
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => onCategoryChange(category.name)}
            >
              {category.name} ({category.count})
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopSearch;
