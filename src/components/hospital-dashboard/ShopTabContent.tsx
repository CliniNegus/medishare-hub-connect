
import React from 'react';
import { Button } from "@/components/ui/button";

const ShopTabContent: React.FC = () => (
  <div className="bg-card p-3 sm:p-4 md:p-6 rounded-lg shadow-sm w-full max-w-full">
    <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 text-foreground">Medical Shop</h2>
    <p className="text-muted-foreground mb-4 text-sm sm:text-base">Purchase disposables and smaller equipment directly</p>
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6 w-full max-w-full">
      {Array(8).fill(null).map((_, idx) => (
        <div key={idx} className="border rounded-lg p-3 sm:p-4 bg-card shadow-sm w-full max-w-full">
          <div className="bg-muted h-20 xs:h-24 sm:h-32 rounded-md mb-3 flex items-center justify-center text-muted-foreground text-xs sm:text-sm">
            Product Image
          </div>
          <h3 className="font-medium text-xs sm:text-sm text-foreground truncate">Disposable Item {idx + 1}</h3>
          <p className="text-xs text-muted-foreground mb-3 truncate">Pack of 100 units</p>
          <div className="flex flex-col gap-2 mt-3 sm:mt-4">
            <span className="font-medium text-[#E02020] text-sm">Ksh {(49 + idx * 10).toFixed(2)}</span>
            <Button size="sm" variant="outline" className="text-xs w-full">Add to Cart</Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ShopTabContent;
