
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
    <div>
    {/* Desktop Table View */}
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[15%]">ID</TableHead>
            <TableHead className="w-[15%]">Date</TableHead>
            <TableHead className="w-[40%]">Description</TableHead>
            <TableHead className="w-[20%] text-right">Amount</TableHead>
            <TableHead className="w-[10%]">Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium break-words">{item.id}</TableCell>
              <TableCell className="break-words">{item.date}</TableCell>
              <TableCell className="break-words">{item.description}</TableCell>
              <TableCell className="text-right">Ksh {item.amount.toLocaleString()}</TableCell>
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
    </div>

    {/* Mobile Card View */}
    <div className="md:hidden space-y-4">
      {transactions.map((item) => (
        <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="font-medium text-gray-900 break-words">{item.id}</div>
            <span className={`px-2 py-1 rounded-full text-xs 
              ${item.type === 'Income' ? 'bg-green-100 text-green-800' : 
                'bg-red-100 text-red-800'}`}>
              {item.type}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Date:</span>
              <span className="text-sm text-gray-900">{item.date}</span>
            </div>
            
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-500">Description:</span>
              <span className="text-sm text-gray-900 text-right break-words max-w-[60%]">{item.description}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Amount:</span>
              <span className="font-semibold text-gray-900">Ksh {item.amount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default TransactionsTab;
