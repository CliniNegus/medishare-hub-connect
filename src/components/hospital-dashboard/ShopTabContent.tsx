
import React from 'react';
import { Button } from "@/components/ui/button";

const ShopTabContent: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
    <h2 className="text-xl font-semibold mb-4">Medical Shop</h2>
    <p className="text-gray-600 mb-4">Purchase disposables and smaller equipment directly</p>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      {Array(8).fill(null).map((_, idx) => (
        <div key={idx} className="border rounded-lg p-4 bg-white shadow-sm">
          <div className="bg-gray-100 h-32 rounded-md mb-3 flex items-center justify-center text-gray-400">
            Product Image
          </div>
          <h3 className="font-medium text-sm">Disposable Item {idx + 1}</h3>
          <p className="text-xs text-gray-500 mb-3">Pack of 100 units</p>
          <div className="flex justify-between items-center mt-4">
            <span className="font-medium text-red-600">${(49 + idx * 10).toFixed(2)}</span>
            <Button size="sm" variant="outline">Add to Cart</Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ShopTabContent;
