
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, TableIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
}

interface TransactionTableProps {
  recentTransactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ recentTransactions }) => {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <TableIcon className="h-5 w-5 mr-2 text-gray-500" />
          Recent Transactions
        </h3>
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%]">Transaction ID</TableHead>
                <TableHead className="w-[15%]">Date</TableHead>
                <TableHead className="w-[35%]">Description</TableHead>
                <TableHead className="w-[15%] text-right">Amount</TableHead>
                <TableHead className="w-[10%]">Type</TableHead>
                <TableHead className="w-[10%] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map(transaction => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium break-words">{transaction.id}</TableCell>
                  <TableCell className="break-words">{transaction.date}</TableCell>
                  <TableCell className="break-words">{transaction.description}</TableCell>
                  <TableCell className="text-right">${transaction.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.type === 'revenue' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'revenue' ? 'Revenue' : 'Expense'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="outline" size="sm" className="h-8 border-red-200 text-red-600 hover:bg-red-50">
                      <FileText className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {recentTransactions.map(transaction => (
            <div key={transaction.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="font-medium text-gray-900 break-words">{transaction.id}</div>
                <Button variant="outline" size="sm" className="h-8 border-red-200 text-red-600 hover:bg-red-50">
                  <FileText className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Date:</span>
                  <span className="text-sm text-gray-900">{transaction.date}</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-500">Description:</span>
                  <span className="text-sm text-gray-900 text-right break-words max-w-[60%]">{transaction.description}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Amount:</span>
                  <span className="font-semibold text-gray-900">${transaction.amount.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Type:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    transaction.type === 'revenue' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.type === 'revenue' ? 'Revenue' : 'Expense'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionTable;
