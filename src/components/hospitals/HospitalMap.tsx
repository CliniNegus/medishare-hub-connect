
import React from 'react';

interface Hospital {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  hospital_clusters?: {
    name: string;
    description: string;
  };
}

interface HospitalMapProps {
  hospitals: Hospital[];
}

export const HospitalMap: React.FC<HospitalMapProps> = ({ hospitals }) => {
  return (
    <div className="w-full aspect-[16/9] bg-gray-100 rounded-lg p-4">
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">
          Interactive map will be implemented here showing {hospitals.length} hospitals
        </p>
      </div>
    </div>
  );
};
