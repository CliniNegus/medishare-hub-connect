
// A simple widget version of the blockchain wallet for dashboards.
import React from 'react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'approved' | 'pending' | 'return';
  hash: string;
}

interface BlockchainWalletWidgetProps {
  balance: number;
  pendingApprovals: number;
  securityLevel: string;
  recentTransactions: Transaction[];
}

const BlockchainWalletWidget: React.FC<BlockchainWalletWidgetProps> = ({
  balance,
  pendingApprovals,
  securityLevel,
  recentTransactions
}) => {
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="text-xl font-bold text-red-600">Blockchain Wallet</div>
          <div className="text-xs text-gray-500">Level: {securityLevel}</div>
        </div>
        <div className="text-lg font-semibold">${balance.toLocaleString()}</div>
      </div>
      <div className="mb-2 text-xs text-gray-700">
        <span className="mr-2">Pending Approvals:</span>
        <span className="font-bold text-black">{pendingApprovals}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[350px] text-xs">
          <thead>
            <tr>
              <th className="font-semibold text-gray-500 px-1 py-1 text-left">Date</th>
              <th className="font-semibold text-gray-500 px-1 py-1 text-left">Description</th>
              <th className="font-semibold text-gray-500 px-1 py-1 text-left">Amount</th>
              <th className="font-semibold text-gray-500 px-1 py-1 text-left">Type</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.slice(0, 4).map(tx => (
              <tr key={tx.id}>
                <td>{tx.date}</td>
                <td className="truncate">{tx.description}</td>
                <td className="font-semibold text-black">${tx.amount.toLocaleString()}</td>
                <td className="capitalize">{tx.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-xs mt-2 text-gray-400">
        Future integration with blockchain/web3 apps enabled.
      </div>
    </div>
  );
};

export default BlockchainWalletWidget;

