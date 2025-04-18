
import React from 'react';
import { MapPin, Phone, Globe, Clock } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Hospital {
  id: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  working_hours?: string;
  hospital_clusters?: {
    name: string;
    description: string;
  };
}

interface HospitalListProps {
  hospitals: Hospital[];
  isLoading: boolean;
}

export const HospitalList: React.FC<HospitalListProps> = ({ hospitals, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hospitals.map((hospital) => (
        <Card key={hospital.id}>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">{hospital.name}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-600" />
                <span>{hospital.address}</span>
              </div>
              {hospital.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-red-600" />
                  <a href={`tel:${hospital.phone}`} className="hover:text-red-600">
                    {hospital.phone}
                  </a>
                </div>
              )}
              {hospital.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-red-600" />
                  <a 
                    href={hospital.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-red-600"
                  >
                    Visit Website
                  </a>
                </div>
              )}
              {hospital.working_hours && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-red-600" />
                  <span>{hospital.working_hours}</span>
                </div>
              )}
              {hospital.hospital_clusters && (
                <div className="mt-2 text-xs">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                    {hospital.hospital_clusters.name}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
