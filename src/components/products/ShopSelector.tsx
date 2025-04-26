
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Shop {
  id: string;
  name: string;
  country: string;
}

interface ShopSelectorProps {
  shops: Shop[];
  selectedShop: string | null;
  onShopSelect: (shopId: string) => void;
}

export const ShopSelector = ({ shops, selectedShop, onShopSelect }: ShopSelectorProps) => {
  return (
    <div className="mb-6">
      <Label>Select Shop</Label>
      <Select value={selectedShop || ''} onValueChange={onShopSelect}>
        <SelectTrigger className="w-[280px] border-red-200 focus:ring-red-500">
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
    </div>
  );
};
