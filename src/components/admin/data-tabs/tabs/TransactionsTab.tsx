
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from '../types';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

interface TransactionsTabProps {
  transactions: Transaction[];
}

const TransactionsTab: React.FC<TransactionsTabProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return <p className="text-gray-500 py-4">No transactions data available.</p>;
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return `Ksh ${amount.toLocaleString()}`;
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Recent Transactions</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {item.type === 'Income' ? (
                    <ArrowUpIcon className="h-4 w-4 mr-1 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 mr-1 text-red-500" />
                  )}
                  {item.type}
                </div>
              </TableCell>
              <TableCell className={`text-right font-medium ${
                item.type === 'Income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(item.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTab;
