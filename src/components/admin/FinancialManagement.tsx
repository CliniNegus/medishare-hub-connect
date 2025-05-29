
import React, { useState } from 'react';
import { CreditCard, DollarSign, Activity, FileText, BarChart2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFinancialData } from '@/hooks/useFinancialData';
import RecordTransactionModal from './financial/RecordTransactionModal';
import TransactionDetailsModal from './financial/TransactionDetailsModal';
import EditTransactionModal from './financial/EditTransactionModal';

interface Transaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  paystack_reference?: string;
  created_at: string;
  updated_at: string;
  metadata?: any;
  user_id: string;
}

interface FinancialManagementProps {
  stats: {
    activeLeases: number;
    totalRevenue: number;
  };
  recentTransactions: any[];
}

const FinancialManagement: React.FC<FinancialManagementProps> = ({ stats, recentTransactions }) => {
  const { transactions, metrics, loading, refreshData } = useFinancialData();
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailsModalOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading financial data...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#333333]">Financial Management</h2>
        <Button variant="primary-red" onClick={() => setRecordModalOpen(true)}>
          <CreditCard className="h-4 w-4 mr-2" />
          Record Transaction
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-red-100 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-900">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${metrics.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-red-700">From successful transactions</p>
          </CardContent>
        </Card>

        <Card className="border-blue-100 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Active Leases</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.activeLeases}</div>
            <p className="text-xs text-blue-700">Currently active contracts</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-100 bg-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Pending Invoices</CardTitle>
            <FileText className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{metrics.pendingInvoices}</div>
            <p className="text-xs text-yellow-700">${metrics.pendingInvoicesAmount.toLocaleString()} outstanding</p>
          </CardContent>
        </Card>

        <Card className="border-green-100 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Monthly Cash Flow</CardTitle>
            <BarChart2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${metrics.cashFlow.toLocaleString()}
            </div>
            <p className="text-xs text-green-700">This month</p>
          </CardContent>
        </Card>
      </div>
      
      <h3 className="text-lg font-semibold mb-4 text-[#333333]">Recent Transactions</h3>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No transactions found. Record your first transaction above.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.reference}</TableCell>
                  <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>${transaction.amount.toLocaleString()}</TableCell>
                  <TableCell>{transaction.currency}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewTransaction(transaction)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditTransaction(transaction)}
                        className="border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <RecordTransactionModal
        open={recordModalOpen}
        onOpenChange={setRecordModalOpen}
        onTransactionAdded={refreshData}
      />

      <TransactionDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        transaction={selectedTransaction}
      />

      <EditTransactionModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        transaction={selectedTransaction}
        onTransactionUpdated={refreshData}
      />
    </div>
  );
};

export default FinancialManagement;
