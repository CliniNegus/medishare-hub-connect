import React, { useState } from 'react';
import { CreditCard, DollarSign, Activity, FileText, BarChart2, Search, Filter, ArrowUpDown, Calendar, Eye, Edit, MoreHorizontal } from 'lucide-react';
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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  user_email?: string;
  user_name?: string;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number, currency: string = 'KES') => {
    return `Ksh ${amount.toLocaleString()}`;
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.paystack_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

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
              Ksh {metrics.totalRevenue.toLocaleString()}
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
            <p className="text-xs text-yellow-700">Ksh {metrics.pendingInvoicesAmount.toLocaleString()} outstanding</p>
          </CardContent>
        </Card>

        <Card className="border-green-100 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Monthly Cash Flow</CardTitle>
            <BarChart2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              Ksh {metrics.cashFlow.toLocaleString()}
            </div>
            <p className="text-xs text-green-700">This month</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-[#E02020]/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#E02020]/5 to-transparent border-b border-[#E02020]/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg font-semibold text-[#333333] flex items-center">
                <Activity className="h-5 w-5 mr-2 text-[#E02020]" />
                Recent Transactions
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {filteredTransactions.length} of {transactions.length} transactions
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search transactions, users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64 border-gray-200 focus:border-[#E02020] focus:ring-[#E02020]"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-gray-200 text-gray-600 hover:border-[#E02020] hover:text-[#E02020]">
                    <Filter className="h-4 w-4 mr-2" />
                    {statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('success')}>Success</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('pending')}>Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('failed')}>Failed</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="outline" 
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="border-gray-200 text-gray-600 hover:border-[#E02020] hover:text-[#E02020]"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500 mb-6">
                {transactions.length === 0 
                  ? "Record your first transaction to get started." 
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              {transactions.length === 0 && (
                <Button onClick={() => setRecordModalOpen(true)} className="bg-[#E02020] hover:bg-[#c01c1c]">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Record First Transaction
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700 px-6 py-4">Reference</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-6 py-4">User</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-6 py-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Date & Time
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 px-6 py-4 text-right">Amount</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-6 py-4">Currency</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-6 py-4">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-6 py-4">Payment Method</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-6 py-4 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction, index) => (
                    <TableRow 
                      key={transaction.id} 
                      className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'
                      }`}
                    >
                      <TableCell className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{transaction.reference}</div>
                          {transaction.paystack_reference && (
                            <div className="text-xs text-gray-500 font-mono">
                              PS: {transaction.paystack_reference}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{transaction.user_name || 'Unknown User'}</div>
                          <div className="text-xs text-gray-500">{transaction.user_email || 'Unknown'}</div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatDate(transaction.created_at)}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="font-semibold text-gray-900">
                          {formatAmount(transaction.amount, transaction.currency)}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge variant="outline" className="font-medium border-gray-200 text-gray-700">
                          {transaction.currency}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge className={`${getStatusColor(transaction.status)} font-medium`}>
                          {transaction.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {transaction.metadata?.payment_method || 'Not specified'}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem 
                                onClick={() => handleViewTransaction(transaction)}
                                className="flex items-center cursor-pointer"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleEditTransaction(transaction)}
                                className="flex items-center cursor-pointer"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Transaction
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

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
