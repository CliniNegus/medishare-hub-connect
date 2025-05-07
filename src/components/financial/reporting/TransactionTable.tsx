
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions.map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>${transaction.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    transaction.type === 'revenue' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.type === 'revenue' ? 'Revenue' : 'Expense'}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="h-8 border-red-200 text-red-600 hover:bg-red-50">
                    <FileText className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TransactionTable;
