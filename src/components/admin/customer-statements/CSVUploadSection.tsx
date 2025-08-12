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