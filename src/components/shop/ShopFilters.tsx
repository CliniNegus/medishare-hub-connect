
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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
  onProductTypeChange,
}: ShopFiltersProps) => {
  return (
    <>
      <Tabs defaultValue="all" value={productType} onValueChange={onProductTypeChange} className="mb-6">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="all" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            All Items
          </TabsTrigger>
          <TabsTrigger value="purchase" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Purchase
          </TabsTrigger>
          <TabsTrigger value="lease" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Lease
          </TabsTrigger>
          <TabsTrigger value="finance" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Finance
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search products..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
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
          <Button variant="outline" size="icon" className="border-red-300">
            <Filter className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ShopFilters;

