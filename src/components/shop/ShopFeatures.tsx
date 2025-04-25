
import React from 'react';
import { Package, Tag, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ShopFeatures = () => {
  const features = [
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Next-day delivery available"
    },
    {
      icon: Package,
      title: "Bulk Discounts",
      description: "Special pricing for large orders"
    },
    {
      icon: Tag,
      title: "Price Match",
      description: "We match any competitor pricing"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {features.map((feature, index) => (
        <Card key={index} className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-3">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <feature.icon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-red-800">{feature.title}</h3>
                <p className="text-sm text-red-700">{feature.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ShopFeatures;
