import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    
    if (lines.length < 3) {
      throw new Error('Invalid CSV format: insufficient data rows');
    }

    // Parse the first row to extract client name and date range
    const firstRowCells = lines[0].split(',').map(cell => cell.replace(/"/g, '').trim());
    
    // The first cell contains multiple lines with company info, client name, and date range
    const firstCellContent = firstRowCells[0];
    const firstCellLines = firstCellContent.split(/[\n\r]+/).map(line => line.trim()).filter(line => line);
    
    let clientName = '';
    let dateRange = '';
    
    // Extract client name from the second line of the first cell
    if (firstCellLines.length >= 2) {
      clientName = firstCellLines[1].trim();
    }
    
    // Extract date range from the last line of the first cell
    if (firstCellLines.length >= 1) {
      const lastLine = firstCellLines[firstCellLines.length - 1].trim();
      if (lastLine.toLowerCase().includes('from') && lastLine.toLowerCase().includes('to')) {
        dateRange = lastLine;
      }
    }

    // Fallback: Search all lines for missing information
    if (!clientName || !dateRange) {
      for (const line of lines) {
        const cleanLine = line.replace(/"/g, '').trim();
        
        // Look for date range pattern
        if (!dateRange && cleanLine.toLowerCase().includes('from') && cleanLine.toLowerCase().includes('to')) {
          dateRange = cleanLine;
        }
        
        // Look for client name (non-numeric line that's not a header or financial term)
        if (!clientName && cleanLine.length > 3 && 
            !cleanLine.toLowerCase().match(/^(opening|invoiced|amount|balance|unnamed|from|to|kes)/)) {
          const potentialName = cleanLine.split(',')[0].trim();
          if (potentialName && !potentialName.match(/^\d/) && !potentialName.includes('KES')) {
            clientName = potentialName;
          }
        }
      }
    }

    // Initialize financial metrics
    let openingBalance = 0;
    let invoicedAmount = 0;
    let amountPaid = 0;
    let balanceDue = 0;

    // Parse financial data using label-based matching (column 0 = labels, column 1 = values)
    for (const line of lines) {
      const cells = line.split(',').map(cell => cell.replace(/"/g, '').trim());
      
      if (cells.length >= 2 && cells[0] && cells[1]) {
        const label = cells[0].toLowerCase();
        const value = cells[1];
        
        // Match labels and extract numeric values from column 1
        if (label.includes('opening balance') || label.includes('brought forward')) {
          openingBalance = parseCurrencyValue(value);
        } else if (label.includes('invoiced amount') || (label.includes('invoiced') && !label.includes('paid'))) {
          invoicedAmount = parseCurrencyValue(value);
        } else if (label.includes('amount paid') || label.includes('payments received')) {
          amountPaid = parseCurrencyValue(value);
        } else if (label.includes('balance due') || (label.includes('balance') && !label.includes('opening'))) {
          balanceDue = parseCurrencyValue(value);
        }
      }
    }

    // Validate that we extracted essential information
    if (!clientName) {
      throw new Error('Could not extract client name from CSV file');
    }

    return {
      client_name: clientName,
      date_range: dateRange || 'Date range not specified',
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
    <Card className="shadow-md border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
              <Upload className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">Upload Customer Statement</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Drag and drop your CSV file here, or click the button below to browse and upload customer statement data. 
              The system will automatically parse client information and financial amounts.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
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
                size="lg"
                className="relative bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                asChild
              >
                <label htmlFor="csv-upload" className="cursor-pointer flex items-center gap-3">
                  <FileText className="h-5 w-5" />
                  {uploading ? 'Processing CSV...' : 'Choose CSV File'}
                </label>
              </Button>
            </div>
            
            {uploading && (
              <div className="flex items-center gap-3 text-primary">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                <span className="text-sm font-medium">Processing file, please wait...</span>
              </div>
            )}
          </div>

          <div className="bg-muted/50 rounded-lg p-4 border border-muted">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="text-left space-y-1">
                <p className="text-sm font-medium text-foreground">CSV Format Requirements:</p>
                <p className="text-xs text-muted-foreground">
                  Your CSV should contain client information in the first row and financial data 
                  (Opening Balance, Invoiced Amount, Amount Paid, Balance Due) in subsequent rows with clear labels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};