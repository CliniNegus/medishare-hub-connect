import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CustomerStatementsTable } from './CustomerStatementsTable';
import { CSVUploadSection } from './CSVUploadSection';
import { formatCurrency } from '@/utils/formatters';

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
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredStatements = statements.filter(statement =>
    statement.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    statement.date_range.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customer Statements</h1>
          <p className="text-muted-foreground">Manage customer financial statements and upload CSV data</p>
        </div>
      </div>

      <CSVUploadSection onUploadSuccess={handleCSVUploadSuccess} />

      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              All Statements ({filteredStatements.length})
            </h2>
            <div className="w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by client name or date range..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <CustomerStatementsTable
          statements={filteredStatements}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default CustomerStatements;