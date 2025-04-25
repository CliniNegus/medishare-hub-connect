
import React from 'react';
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ShopSearchProps {
  categories: { id: number; name: string; count: number; }[];
  onSearchChange: (term: string) => void;
  onCategoryChange: (category: string) => void;
}

const ShopSearch = ({ categories, onSearchChange, onCategoryChange }: ShopSearchProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search products..." 
          className="pl-10 border-red-200 focus:border-red-500 focus:ring-red-500"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <select 
          className="border border-red-200 rounded-md px-3 py-2 bg-white text-sm"
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.name}>{category.name}</option>
          ))}
        </select>
        <Button variant="outline" size="icon" className="border-red-200 text-red-600">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ShopSearch;
