
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PiggyBank, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface InvestorWalletProps {
  balance: number;
  totalInvested: number;
  returns: number;
  returnsPercentage: number;
  recentTransactions: {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'deposit' | 'withdrawal' | 'return';
  }[];
}

const InvestorWallet: React.FC<InvestorWalletProps> = ({
  balance,
  totalInvested,
  returns,
  returnsPercentage,
  recentTransactions
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <PiggyBank className="mr-2 h-5 w-5 text-medical-primary" />
          Investor Wallet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-4 bg-medical-light rounded-md">
            <p className="text-sm text-gray-500 mb-1">Available Balance</p>
            <p className="text-2xl font-bold">${balance.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-medical-light rounded-md">
            <p className="text-sm text-gray-500 mb-1">Total Invested</p>
            <p className="text-2xl font-bold">${totalInvested.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-medical-light rounded-md">
            <p className="text-sm text-gray-500 mb-1">Returns</p>
            <div className="flex items-end">
              <p className="text-2xl font-bold">${returns.toLocaleString()}</p>
              <span className={`ml-2 flex items-center text-sm ${
                returnsPercentage >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {returnsPercentage >= 0 ? 
                  <TrendingUp className="h-3 w-3 mr-1" /> : 
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                }
                {Math.abs(returnsPercentage)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <p className="text-sm text-gray-500">Investment Usage</p>
            <p className="text-sm font-medium">68%</p>
          </div>
          <Progress value={68} className="h-2" />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Recent Transactions</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {recentTransactions.map(transaction => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-2 text-sm border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
                <div className={`flex items-center ${
                  transaction.type === 'withdrawal' ? 'text-red-500' : 
                  transaction.type === 'return' ? 'text-green-500' : 'text-medical-primary'
                }`}>
                  {transaction.type === 'withdrawal' ? 
                    <ArrowDownRight className="h-3 w-3 mr-1" /> : 
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  }
                  ${transaction.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestorWallet;
