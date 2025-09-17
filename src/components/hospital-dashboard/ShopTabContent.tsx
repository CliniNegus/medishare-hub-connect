
import React from 'react';
import { Button } from "@/components/ui/button";

const ShopTabContent: React.FC = () => (
  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6">
    <h2 className="text-lg sm:text-xl font-semibold mb-4">Medical Shop</h2>
    <p className="text-gray-600 mb-4 text-sm sm:text-base">Purchase disposables and smaller equipment directly</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
      {Array(8).fill(null).map((_, idx) => (
        <div key={idx} className="border rounded-lg p-3 sm:p-4 bg-white shadow-sm">
          <div className="bg-gray-100 h-24 sm:h-32 rounded-md mb-3 flex items-center justify-center text-gray-400 text-xs sm:text-sm">
            Product Image
          </div>
          <h3 className="font-medium text-xs sm:text-sm">Disposable Item {idx + 1}</h3>
          <p className="text-xs text-gray-500 mb-3">Pack of 100 units</p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between sm:items-center mt-4">
            <span className="font-medium text-red-600 text-sm">Ksh {(49 + idx * 10).toFixed(2)}</span>
            <Button size="sm" variant="outline" className="text-xs">Add to Cart</Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ShopTabContent;
