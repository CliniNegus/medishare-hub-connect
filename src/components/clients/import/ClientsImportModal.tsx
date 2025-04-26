
import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import CSVDropzone from './CSVDropzone';
import CSVPreview from './CSVPreview';

interface ClientsImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
}

interface ImportedClient {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

const ClientsImportModal: React.FC<ClientsImportModalProps> = ({ 
  open, 
  onOpenChange,
  onImportComplete 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [importing, setImporting] = useState(false);
  const [parsedData, setParsedData] = useState<ImportedClient[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const validateData = (data: any[]): { valid: ImportedClient[], errors: string[] } => {
    const errors: string[] = [];
    const valid: ImportedClient[] = [];

    data.forEach((row, index) => {
      if (!row.name) {
        errors.push(`Row ${index + 1}: Missing required field 'name'`);
        return;
      }

      if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
        errors.push(`Row ${index + 1}: Invalid email format`);
        return;
      }

      valid.push({
        name: row.name,
        email: row.email || null,
        phone: row.phone || null,
        address: row.address || null
      });
    });

    return { valid, errors };
  };

  const handleFileSelect = useCallback((file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const { valid, errors } = validateData(results.data);
        setParsedData(valid);
        setErrors(errors);
      },
      error: (error) => {
        toast({
          title: "Error parsing CSV",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  }, [toast]);

  const handleImport = async () => {
    if (!user || parsedData.length === 0) return;

    setImporting(true);
    try {
      const { error } = await supabase
        .from('clients')
        .insert(
          parsedData.map(client => ({
            organization_id: user.id,
            name: client.name,
            email: client.email,
            phone: client.phone,
            address: client.address,
            source: 'csv'
          }))
        );

      if (error) throw error;

      toast({
        title: "Import successful",
        description: `Successfully imported ${parsedData.length} clients.`,
      });

      onImportComplete();
      onOpenChange(false);
      setParsedData([]);
      setErrors([]);
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Import Clients from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing client information. The file should include columns for name (required), email, phone, and address.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {parsedData.length === 0 ? (
            <CSVDropzone onFileSelect={handleFileSelect} />
          ) : (
            <>
              <CSVPreview data={parsedData} errors={errors} />
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setParsedData([]);
                    setErrors([]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={importing || errors.length > 0}
                >
                  {importing ? "Importing..." : `Import ${parsedData.length} Clients`}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientsImportModal;
