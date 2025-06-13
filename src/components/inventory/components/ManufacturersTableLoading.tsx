
import React from 'react';

const ManufacturersTableLoading: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="animate-pulse bg-gray-200 h-10 w-80 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
      </div>
      <div className="bg-white rounded-lg border">
        <div className="animate-pulse p-8">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex space-x-4 mb-4">
              <div className="bg-gray-200 h-12 w-12 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="bg-gray-200 h-4 w-48 rounded"></div>
                <div className="bg-gray-200 h-3 w-32 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManufacturersTableLoading;
