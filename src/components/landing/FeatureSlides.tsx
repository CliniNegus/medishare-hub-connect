import React, { useState } from 'react';
import ImageUploadWidget from '@/components/widgets/ImageUploadWidget';

const featureSlidesConfig = [
  {
    user: 'hospital',
    title: 'For Hospitals',
    features: [
      {
        id: 'inventory',
        title: 'Free Inventory & Equipment Management',
        description: 'Comprehensive system to manage your medical inventory and equipment with zero hidden costs.',
        defaultImage: 'photo-1488590528505-98d2b5aba04b', // turned on gray laptop computer
      },
      {
        id: 'wallet',
        title: 'Access Investors & Financing',
        description: 'Secure wallet integration provides direct access to financing partners and investors on the platform.',
        defaultImage: 'photo-1581091226825-a6a2a5aee158', // woman using computer
      },
      {
        id: 'therapy',
        title: 'Therapy-as-a-Service (Pay Per Use)',
        description: 'Unlock cutting-edge therapy devices on a pay-per-use basis, eliminating massive upfront costs.',
        defaultImage: 'photo-1518770660439-4636190af475', // macro black circuit board
      },
    ]
  },
  {
    user: 'manufacturer',
    title: 'For Manufacturers',
    features: [
      {
        id: 'track',
        title: 'Track, Lease & Monitor Equipment (IoT)',
        description: 'Lease, track and monitor your equipment in real-time using integrated IoT solutions for maximum ROI.',
        defaultImage: 'photo-1519389950473-47ba0277781c', // people w/ laptops
      },
      {
        id: 'lease',
        title: 'Boost Leasing & Sales Reach',
        description: 'Expand your distribution, leasing medical equipment to a nationwide network of hospitals.',
        defaultImage: 'photo-1605810230434-7631ac76ec81', // business group video screens
      },
      {
        id: 'analytics',
        title: 'Automated Compliance & Analytics',
        description: 'Get automated analytics and compliance documentation for all your equipment transactions.',
        defaultImage: 'photo-1498050108023-c5249f4df085', // MacBook w/ code
      },
    ]
  },
  {
    user: 'investor',
    title: 'For Investors',
    features: [
      {
        id: 'revenue',
        title: 'Access Medical Equipment ROI',
        description: 'Invest directly into high-probability medical leasing and diversify your healthcare portfolio.',
        defaultImage: 'photo-1461749280684-dccba630e2f6', // monitor Java
      },
      {
        id: 'wallet',
        title: 'Blockchain Wallet & Transactions',
        description: 'Blockchain-encrypted wallet for secure investments, approvals, withdrawals and audits.',
        defaultImage: 'photo-1518877593221-1f28583780b4', // whale
      },
      {
        id: 'insights',
        title: 'Real-Time Portfolio Insights',
        description: 'Get granular metrics and insights on your capital deployment in the healthcare sector.',
        defaultImage: 'photo-1526374965328-7f61d4dc18c5', // Matrix code
      },
    ]
  }
];

type UserType = 'hospital' | 'manufacturer' | 'investor';

const getTabColor = (user: UserType, active: boolean) =>
  active
    ? 'bg-white text-black border-b-2 border-red-600'
    : 'bg-gray-100 text-gray-500';

const FeatureSlides = () => {
  const [activeUser, setActiveUser] = useState<UserType>('hospital');
  const [customImages, setCustomImages] = useState<Record<string, string>>({});

  const slides = featureSlidesConfig.find(s => s.user === activeUser)!;

  const handleImageChange = (featureId: string, newImage: string) => {
    setCustomImages((current) => ({
      ...current,
      [activeUser + '-' + featureId]: newImage,
    }));
  };

  return (
    <div>
      <div className="flex justify-center mb-8">
        {featureSlidesConfig.map(s => (
          <button
            key={s.user}
            onClick={() => setActiveUser(s.user as UserType)}
            className={`px-6 py-2 rounded-t-lg font-semibold transition-all focus:outline-none ${getTabColor(s.user as UserType, s.user === activeUser)}`}
          >
            {s.title}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {slides.features.map(feature => (
          <div key={feature.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 relative">
            <div className="rounded-md overflow-hidden mb-4 flex items-center justify-center h-40 bg-gray-50">
              <img
                src={
                  customImages[activeUser + '-' + feature.id]
                    ? customImages[activeUser + '-' + feature.id]
                    : `https://images.unsplash.com/${feature.defaultImage}?auto=format&fit=cover&w=500&q=80`
                }
                alt={feature.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-2 right-2">
                {/* Image Upload Widget */}
                <ImageUploadWidget
                  onImageChange={(imgUrl) => handleImageChange(feature.id, imgUrl)}
                  defaultImage={`https://images.unsplash.com/${feature.defaultImage}?auto=format&fit=cover&w=500&q=80`}
                />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-black">{feature.title}</h3>
            <p className="text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSlides;
