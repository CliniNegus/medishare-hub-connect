
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

export const NoShopsMessage = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-xl font-medium text-gray-900 mb-2">No Virtual Shop Found</h2>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        You need to create a virtual shop before adding products. Create your first shop to continue.
      </p>
      <Button 
        onClick={() => navigate('/virtual-shops')} 
        className="bg-red-600 hover:bg-red-700"
      >
        Create a Shop
      </Button>
    </div>
  );
};
