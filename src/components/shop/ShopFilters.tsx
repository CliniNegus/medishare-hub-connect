
import React from 'react';
import { Search, SlidersVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ShopFiltersProps {
  searchTerm: string;
  category: string;
  productType: string;
  sortBy: string;
  uniqueCategories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onProductTypeChange: (value: string) => void;
  onSortByChange: (value: string) => void;
}

const ShopFilters = ({
  searchTerm,
  category,
  productType,
  sortBy,
  uniqueCategories,
  onSearchChange,
  onCategoryChange,
  onProductTypeChange,
  onSortByChange
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
      
      <div className="flex gap-2 flex-wrap">
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="border-red-300" aria-label="Sort options">
              <SlidersVertical className="h-4 w-4 text-red-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sortBy} onValueChange={onSortByChange}>
              <DropdownMenuRadioItem value="popularity">Popularity</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="price_low_to_high">Price: Low to High</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="price_high_to_low">Price: High to Low</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ShopFilters;
