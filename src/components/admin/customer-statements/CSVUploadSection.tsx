import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';
import { parseCurrencyValue } from '@/utils/formatters';

interface CSVUploadSectionProps {
  onUploadSuccess: () => void;
}

export const CSVUploadSection: React.FC<CSVUploadSectionProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const parseCSVStatement = (csvContent: string) => {
    const lines = csvContent.split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length < 5) {
      throw new Error('Invalid CSV format: insufficient data rows');
    }

    // Parse the first row to extract client name and date range
    const firstRowCells = lines[0].split(',').map(cell => cell.replace(/"/g, '').trim());
    const firstCellLines = firstRowCells[0].split('\n').filter(line => line.trim());
    
    let clientName = '';
    let dateRange = '';
    
    // Extract client name (usually the second line in the first cell)
    if (firstCellLines.length >= 2) {
      clientName = firstCellLines[1].trim();
    }
    
    // Extract date range (usually the last line in the first cell)
    if (firstCellLines.length >= 1) {
      const lastLine = firstCellLines[firstCellLines.length - 1].trim();
      if (lastLine.toLowerCase().includes('from') && lastLine.toLowerCase().includes('to')) {
        dateRange = lastLine;
      }
    }

    // If we couldn't parse from the first cell, try to find it in other ways
    if (!clientName || !dateRange) {
      // Look for patterns in all lines
      for (const line of lines) {
        if (line.toLowerCase().includes('from') && line.toLowerCase().includes('to')) {
          dateRange = line.replace(/"/g, '').trim();
        }
        // Look for potential client names (lines that don't contain numbers or special formatting)
        if (!clientName && line.length > 5 && !line.includes('Opening') && !line.includes('Invoiced') && !line.includes('Amount') && !line.includes('Balance')) {
          const cleanLine = line.replace(/"/g, '').replace(/,/g, '').trim();
          if (cleanLine && !cleanLine.match(/^\d/) && !cleanLine.includes('KES')) {
            clientName = cleanLine;
          }
        }
      }
    }

    // Parse financial data from subsequent rows
    let openingBalance = 0;
    let invoicedAmount = 0;
    let amountPaid = 0;
    let balanceDue = 0;

    // Look for financial data in the format expected
    for (let i = 1; i < Math.min(lines.length, 10); i++) {
      const cells = lines[i].split(',').map(cell => cell.replace(/"/g, '').trim());
      
      if (cells.length >= 2) {
        const label = cells[0].toLowerCase();
        const value = cells[1];
        
        if (label.includes('opening') || label.includes('brought forward')) {
          openingBalance = parseCurrencyValue(value);
        } else if (label.includes('invoiced') || label.includes('invoice')) {
          invoicedAmount = parseCurrencyValue(value);
        } else if (label.includes('amount paid') || label.includes('payments')) {
          amountPaid = parseCurrencyValue(value);
        } else if (label.includes('balance') || label.includes('due')) {
          balanceDue = parseCurrencyValue(value);
        }
      }
    }

    return {
      client_name: clientName || 'Unknown Client',
      date_range: dateRange || 'Unknown Period',
      opening_balance: openingBalance,
      invoiced_amount: invoicedAmount,
      amount_paid: amountPaid,
      balance_due: balanceDue,
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "Error",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const text = await file.text();
      const parsedStatement = parseCSVStatement(text);

      const { error } = await supabase
        .from('customer_statements')
        .insert([parsedStatement]);

      if (error) throw error;

      onUploadSuccess();
      
      // Reset the file input
      event.target.value = '';
      
    } catch (error) {
      console.error('Error processing CSV:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process CSV file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Upload CSV Statement</h3>
      </div>
      
      <p className="text-muted-foreground mb-4">
        Upload a CSV file containing customer statement data. The system will automatically parse 
        client name, date range, and financial amounts.
      </p>

      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            id="csv-upload"
          />
          <Button 
            disabled={uploading}
            className="relative"
            asChild
          >
            <label htmlFor="csv-upload" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Processing...' : 'Upload CSV File'}
            </label>
          </Button>
        </div>
        
        {uploading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm">Processing file...</span>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-muted rounded-md">
        <p className="text-sm text-muted-foreground">
          <strong>CSV Format Expected:</strong> The file should contain client information and financial data 
          with labels like "Opening Balance", "Invoiced Amount", "Amount Paid", and "Balance Due".
        </p>
      </div>
    </div>
  );
};