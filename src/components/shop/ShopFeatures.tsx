
import React from 'react';
import { TruckIcon, Clock, ShieldCheck, BadgeCheck } from 'lucide-react';

const ShopFeatures = () => {
  const features = [
    {
      icon: <TruckIcon className="h-6 w-6 text-red-600" />,
      title: 'Fast Delivery',
      description: 'Same-day delivery for critical supplies'
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-red-600" />,
      title: 'Quality Guaranteed',
      description: 'All products meet medical standards'
    },
    {
      icon: <Clock className="h-6 w-6 text-red-600" />,
      title: '24/7 Support',
      description: 'Technical support available round the clock'
    },
    {
      icon: <BadgeCheck className="h-6 w-6 text-red-600" />,
      title: 'Verified Products',
      description: 'Certified by medical authorities'
    }
  ];
  
  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-lg font-semibold mb-6">Why Shop With Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="border rounded-lg p-4 flex flex-col items-center text-center">
            <div className="bg-red-50 p-3 rounded-full mb-3">
              {feature.icon}
            </div>
            <h3 className="font-medium mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-500">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopFeatures;
