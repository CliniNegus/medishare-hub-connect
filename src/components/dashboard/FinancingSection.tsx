
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calculator, Wallet } from "lucide-react";
import { Link } from 'react-router-dom';

const FinancingSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-red-50 to-black/5 rounded-lg p-4 border border-red-100">
      <h2 className="text-lg font-medium mb-2 text-red-800">Equipment Financing Options</h2>
      <p className="text-sm text-red-700 mb-3">
        Need new equipment? Explore financing options or check your investor wallet.
      </p>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Link to="/financing" className="flex-1">
          <Button variant="default" className="w-full bg-red-600 hover:bg-red-700">
            <Calculator className="h-4 w-4 mr-2" />
            Financing Calculator
          </Button>
        </Link>
        <Button variant="outline" className="flex-1 border-red-300">
          <Wallet className="h-4 w-4 mr-2" />
          Investor Wallet
        </Button>
      </div>
    </div>
  );
};

export default FinancingSection;
