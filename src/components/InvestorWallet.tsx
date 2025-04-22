
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PiggyBank, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import BlockchainWallet from './wallet/BlockchainWallet';

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
  // Blockchain wallet example data
  const blockchainWalletData = {
    balance: Math.round(balance * 0.7), // 70% of balance in blockchain wallet
    pendingApprovals: 3,
    securityLevel: 'enhanced' as const,
    recentTransactions: [
      {
        id: 'BC001',
        date: '2025-04-15',
        description: 'Investment in Hospital Cluster',
        amount: 15000,
        type: 'withdrawal' as const,
        hash: '0x8f2d15e8a1b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1'
      },
      {
        id: 'BC002',
        date: '2025-04-10',
        description: 'Return from MRI Investment',
        amount: 2250,
        type: 'return' as const,
        hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
      },
      {
        id: 'BC003',
        date: '2025-04-05',
        description: 'Fund Deposit',
        amount: 30000,
        type: 'deposit' as const,
        hash: '0xf1e2d3c4b5a6978695a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2'
      },
      {
        id: 'BC004',
        date: '2025-04-01',
        description: 'Equipment Financing Approval',
        amount: 18500,
        type: 'approved' as const,
        hash: '0x7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e'
      },
      {
        id: 'BC005',
        date: '2025-03-28',
        description: 'Pending Equipment Request',
        amount: 12000,
        type: 'pending' as const,
        hash: '0x2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3'
      }
    ]
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <PiggyBank className="mr-2 h-5 w-5 text-red-500" />
            Investor Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500 mb-1">Available Balance</p>
              <p className="text-2xl font-bold">${balance.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500 mb-1">Total Invested</p>
              <p className="text-2xl font-bold">${totalInvested.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
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
                    transaction.type === 'return' ? 'text-green-500' : 'text-red-500'
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
      
      <BlockchainWallet {...blockchainWalletData} />
    </div>
  );
};

export default InvestorWallet;
