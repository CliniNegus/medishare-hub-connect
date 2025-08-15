import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CustomerStatementsTable } from './CustomerStatementsTable';
import { CSVUploadSection } from './CSVUploadSection';
import { ManualRecordModal } from './ManualRecordModal';
import { formatCurrency } from '@/utils/formatters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, TrendingUp, TrendingDown, Plus } from 'lucide-react';

export interface CustomerStatement {
  id: string;
  client_name: string;
  date_range: string;
  opening_balance: number;
  invoiced_amount: number;
  amount_paid: number;
  balance_due: number;
  created_at: string;
  updated_at: string;
}

const CustomerStatements = () => {
  const [statements, setStatements] = useState<CustomerStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientNameFilter, setClientNameFilter] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState('');
  const [showManualModal, setShowManualModal] = useState(false);
  const { toast } = useToast();

  const fetchStatements = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_statements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStatements(data || []);
    } catch (error) {
      console.error('Error fetching statements:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customer statements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<CustomerStatement>) => {
    try {
      const { error } = await supabase
        .from('customer_statements')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setStatements(prev => 
        prev.map(stmt => stmt.id === id ? { ...stmt, ...updates } : stmt)
      );

      toast({
        title: "Success",
        description: "Statement updated successfully",
      });
    } catch (error) {
      console.error('Error updating statement:', error);
      toast({
        title: "Error",
        description: "Failed to update statement",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customer_statements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStatements(prev => prev.filter(stmt => stmt.id !== id));

      toast({
        title: "Success",
        description: "Statement deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting statement:', error);
      toast({
        title: "Error",
        description: "Failed to delete statement",
        variant: "destructive",
      });
    }
  };

  const handleCSVUploadSuccess = () => {
    fetchStatements();
    toast({
      title: "Success",
      description: "CSV data uploaded successfully",
    });
  };

  const handleManualRecordSuccess = () => {
    fetchStatements();
  };

  useEffect(() => {
    fetchStatements();

    // Set up real-time subscription
    const channel = supabase
      .channel('customer_statements_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customer_statements'
        },
        () => {
          fetchStatements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredStatements = statements.filter(statement => {
    const matchesClient = !clientNameFilter || 
      statement.client_name.toLowerCase().includes(clientNameFilter.toLowerCase());
    const matchesDateRange = !dateRangeFilter || 
      statement.date_range.toLowerCase().includes(dateRangeFilter.toLowerCase());
    return matchesClient && matchesDateRange;
  });

  // Calculate summary statistics
  const totalClients = new Set(statements.map(s => s.client_name)).size;
  const totalInvoiced = statements.reduce((sum, s) => sum + s.invoiced_amount, 0);
  const totalPaid = statements.reduce((sum, s) => sum + s.amount_paid, 0);
  const totalOutstanding = statements.reduce((sum, s) => sum + s.balance_due, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Customer Statements</h1>
        <p className="text-lg text-muted-foreground">
          Manage customer financial statements and upload CSV data
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalClients}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoiced</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(totalInvoiced)}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(totalPaid)}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(totalOutstanding)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      <CSVUploadSection onUploadSuccess={handleCSVUploadSuccess} />

      {/* Data Table Section */}
      <Card className="shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl">All Statements</CardTitle>
              <CardDescription>
                {filteredStatements.length} of {statements.length} statements
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowManualModal(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Record
              </Button>
              <Badge variant="secondary" className="text-sm">
                {filteredStatements.length} records
              </Badge>
            </div>
          </div>

          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Filter by Client</label>
              <Input
                type="text"
                placeholder="Enter client name..."
                value={clientNameFilter}
                onChange={(e) => setClientNameFilter(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Filter by Date Range</label>
              <Input
                type="text"
                placeholder="Enter date range..."
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="flex items-end">
              {(clientNameFilter || dateRangeFilter) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setClientNameFilter('');
                    setDateRangeFilter('');
                  }}
                  className="h-10"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <CustomerStatementsTable
            statements={filteredStatements}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Manual Record Modal */}
      <ManualRecordModal
        open={showManualModal}
        onOpenChange={setShowManualModal}
        onSuccess={handleManualRecordSuccess}
      />
    </div>
  );
};

export default CustomerStatements;