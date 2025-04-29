
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Shop {
  id: string;
  name: string;
  country: string;
}

interface ShopSelectorProps {
  shops: Shop[];
  selectedShop: string | null;
  onShopSelect: (shopId: string) => void;
  loading: boolean;
}

export const ShopSelector: React.FC<ShopSelectorProps> = ({ 
  shops, 
  selectedShop, 
  onShopSelect,
  loading
}) => {
  return (
    <div className="mb-4">
      <Label htmlFor="shop">Select Shop</Label>
      <Select 
        value={selectedShop || ''} 
        onValueChange={onShopSelect}
        disabled={loading || shops.length === 0}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a shop" />
        </SelectTrigger>
        <SelectContent>
          {shops.map((shop) => (
            <SelectItem key={shop.id} value={shop.id}>
              {shop.name} ({shop.country})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {shops.length === 0 && !loading && (
        <p className="text-sm text-red-500 mt-1">
          No shops available. Please create a shop first.
        </p>
      )}
    </div>
  );
};

export default ShopSelector;
