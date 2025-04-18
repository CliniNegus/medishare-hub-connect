
import React from 'react';
import HospitalMap from '@/components/maps/HospitalMap';
import { Helmet } from 'react-helmet';

const HospitalLocations = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>CliniBuilds - Hospital Locations</title>
      </Helmet>
      <h1 className="text-3xl font-bold mb-6 text-red-600">Hospital Locations</h1>
      <p className="text-gray-600 mb-8">
        Find hospitals in Nairobi to connect with on the CliniBuilds platform.
      </p>
      <HospitalMap />
    </div>
  );
};

export default HospitalLocations;
