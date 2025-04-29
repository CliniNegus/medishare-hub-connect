
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from './types';

interface TransactionsTabProps {
  transactions: Transaction[];
}

const TransactionsTab: React.FC<TransactionsTabProps> = ({ transactions }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.id}</TableCell>
            <TableCell>{item.date}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>${item.amount.toLocaleString()}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs 
                ${item.type === 'Income' ? 'bg-green-100 text-green-800' : 
                  'bg-red-100 text-red-800'}`}>
                {item.type}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TransactionsTab;
