
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface BlockchainWalletProps {
  balance: number;
  pendingApprovals: number;
  securityLevel: 'standard' | 'enhanced' | 'maximum';
  recentTransactions: {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'deposit' | 'withdrawal' | 'return' | 'approved' | 'pending';
    hash?: string;
  }[];
}

const BlockchainWallet: React.FC<BlockchainWalletProps> = ({
  balance,
  pendingApprovals,
  securityLevel,
  recentTransactions
}) => {
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const handleViewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
  };

  const getSecurityLevelProgress = () => {
    switch (securityLevel) {
      case 'standard': return 33;
      case 'enhanced': return 66;
      case 'maximum': return 100;
      default: return 33;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 bg-white border-b">
        <CardTitle className="text-lg flex items-center">
          <Wallet className="mr-2 h-5 w-5 text-red-500" />
          Blockchain Encrypted Wallet
          <Shield className="ml-2 h-4 w-4 text-green-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500 mb-1">Available Balance</p>
            <p className="text-2xl font-bold">${balance.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500 mb-1">Pending Approvals</p>
            <p className="text-2xl font-bold">{pendingApprovals}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <p className="text-sm text-gray-500">Security Level: {securityLevel.charAt(0).toUpperCase() + securityLevel.slice(1)}</p>
            <p className="text-sm font-medium">{getSecurityLevelProgress()}%</p>
          </div>
          <Progress value={getSecurityLevelProgress()} className="h-2" />
        </div>

        <div className="flex space-x-2 mb-4">
          <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white">
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Deposit
          </Button>
          <Button variant="outline" className="flex-1 border-red-600 text-red-600 hover:bg-red-50">
            <ArrowDownRight className="h-4 w-4 mr-2" />
            Withdraw
          </Button>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <span className="mr-2">Blockchain Transactions</span> 
            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Encrypted</span>
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {recentTransactions.map(transaction => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-2 text-sm border-b last:border-0 cursor-pointer hover:bg-gray-50"
                onClick={() => handleViewTransaction(transaction)}
              >
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
                <div className={`flex items-center ${
                  transaction.type === 'withdrawal' ? 'text-red-500' : 
                  transaction.type === 'return' || transaction.type === 'deposit' ? 'text-green-500' : 
                  transaction.type === 'approved' ? 'text-blue-500' : 'text-yellow-500'
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

        <div className="mt-4 border-t pt-4">
          <p className="text-xs text-gray-500 flex items-center">
            <Shield className="h-3 w-3 mr-1 text-green-500" />
            Blockchain encrypted and secure. Ready for future integrations.
          </p>
        </div>

        <Dialog open={showTransactionDetails} onOpenChange={setShowTransactionDetails}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogDescription>
                Blockchain transaction information
              </DialogDescription>
            </DialogHeader>
            {selectedTransaction && (
              <div className="py-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">ID:</span>
                    <span className="font-mono">{selectedTransaction.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span>{selectedTransaction.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount:</span>
                    <span className={`font-medium ${
                      selectedTransaction.type === 'withdrawal' ? 'text-red-500' : 
                      selectedTransaction.type === 'return' || selectedTransaction.type === 'deposit' ? 'text-green-500' : 
                      'text-gray-900'
                    }`}>
                      ${selectedTransaction.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span className="capitalize">{selectedTransaction.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Description:</span>
                    <span>{selectedTransaction.description}</span>
                  </div>
                  {selectedTransaction.hash && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Blockchain Hash:</span>
                      <span className="font-mono text-xs overflow-hidden text-ellipsis">{selectedTransaction.hash}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setShowTransactionDetails(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BlockchainWallet;
