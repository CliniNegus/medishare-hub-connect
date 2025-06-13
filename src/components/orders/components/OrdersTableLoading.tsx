
import React from 'react';

const OrdersTableLoading: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E02020]"></div>
      </div>
    </div>
  );
};

export default OrdersTableLoading;
