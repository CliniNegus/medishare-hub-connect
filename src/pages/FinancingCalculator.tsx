
import React from 'react';
import Header from '@/components/Header';
import EquipmentFinancingCalculator from '@/components/EquipmentFinancingCalculator';

const FinancingCalculator = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Equipment Financing</h1>
          <div className="space-y-6">
            <p className="text-gray-600">
              Calculate your monthly payments and apply for equipment financing with our investor network.
              Get competitive rates for medical equipment purchases with flexible terms.
            </p>
            <EquipmentFinancingCalculator />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinancingCalculator;
