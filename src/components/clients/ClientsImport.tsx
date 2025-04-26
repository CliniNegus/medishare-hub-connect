
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { Upload, FileText, Database } from 'lucide-react';
import Papa from 'papaparse';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Client {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  metadata?: Record<string, any>;
}

interface ZohoCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

const ClientsImport = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importedClients, setImportedClients] = useState<Client[]>([]);
  const [zohoCredentials, setZohoCredentials] = useState<ZohoCredentials>({
    clientId: '',
    clientSecret: '',
    refreshToken: '',
  });

  const handleCsvFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    setCsvFile(file);
  };

  const parseCsvFile = useCallback(() => {
    if (!csvFile) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    Papa.parse(csvFile, {
      header: true,
      complete: (results) => {
        const validClients: Client[] = [];
        const errors: string[] = [];
        
        results.data.forEach((row: any, index: number) => {
          if (!row.name) {
            errors.push(`Row ${index + 1}: Missing name field`);
            return;
          }
          
          validClients.push({
            name: row.name,
            email: row.email || null,
            phone: row.phone || null,
            address: row.address || null,
          });
        });
        
        if (errors.length > 0) {
          toast({
            title: `Found ${errors.length} errors in CSV`,
            description: errors.slice(0, 3).join('\n') + (errors.length > 3 ? '...' : ''),
            variant: "destructive",
          });
        }
        
        setImportedClients(validClients);
        setUploading(false);
      },
      error: (error) => {
        toast({
          title: "Error parsing CSV",
          description: error.message,
          variant: "destructive",
        });
        setUploading(false);
      }
    });
  }, [csvFile, toast]);

  const importClientsFromCsv = async () => {
    if (!user || importedClients.length === 0) return;

    setUploading(true);
    try {
      const { error } = await supabase
        .from('clients')
        .insert(
          importedClients.map(client => ({
            organization_id: user.id,
            name: client.name,
            email: client.email,
            phone: client.phone,
            address: client.address,
            source: 'csv',
            metadata: client.metadata || {}
          }))
        );

      if (error) throw error;

      toast({
        title: "Import successful",
        description: `Successfully imported ${importedClients.length} clients.`,
      });

      // Reset state after successful import
      setCsvFile(null);
      setImportedClients([]);
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleZohoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setZohoCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const connectToZohoBooks = async () => {
    setUploading(true);
    try {
      // This is a placeholder - in a real implementation, we would:
      // 1. Send credentials to a serverless function that handles OAuth
      // 2. Retrieve and store access tokens securely
      // 3. Use the access token to fetch clients from Zoho Books API
      
      toast({
        title: "Zoho Books Connection",
        description: "Connection to Zoho Books will be implemented in a future update.",
      });
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full border-red-600">
      <CardHeader>
        <CardTitle className="text-red-600">Import Clients</CardTitle>
        <CardDescription>Import clients from CSV or connect to Zoho Books</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="csv" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="csv">CSV Import</TabsTrigger>
            <TabsTrigger value="zoho">Zoho Books</TabsTrigger>
          </TabsList>
          
          <TabsContent value="csv" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="csv-file" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload CSV File
                </label>
                {csvFile ? (
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700">{csvFile.name}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCsvFile(null)}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                    onClick={() => document.getElementById('csv-file-upload')?.click()}
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload CSV file</p>
                    <p className="text-xs text-gray-400 mt-1">CSV with columns: name, email, phone, address</p>
                  </div>
                )}
                <input
                  id="csv-file-upload"
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleCsvFileChange}
                />
              </div>
              
              {csvFile && (
                <Button 
                  onClick={parseCsvFile}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={uploading}
                >
                  Parse CSV File
                </Button>
              )}
              
              {importedClients.length > 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Found {importedClients.length} Clients</h3>
                    <div className="mt-2 max-h-40 overflow-y-auto border rounded-md">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {importedClients.slice(0, 5).map((client, index) => (
                            <tr key={index}>
                              <td className="px-3 py-2 text-sm text-gray-900">{client.name}</td>
                              <td className="px-3 py-2 text-sm text-gray-500">{client.email || '-'}</td>
                              <td className="px-3 py-2 text-sm text-gray-500">{client.phone || '-'}</td>
                            </tr>
                          ))}
                          {importedClients.length > 5 && (
                            <tr>
                              <td colSpan={3} className="px-3 py-2 text-sm text-gray-500 text-center">
                                And {importedClients.length - 5} more...
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={importClientsFromCsv}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    disabled={uploading}
                  >
                    {uploading ? "Importing..." : `Import ${importedClients.length} Clients`}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="zoho" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-2">
                  Zoho Client ID
                </label>
                <Input
                  id="clientId"
                  name="clientId"
                  value={zohoCredentials.clientId}
                  onChange={handleZohoInputChange}
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  placeholder="Enter Zoho Client ID"
                />
              </div>
              
              <div>
                <label htmlFor="clientSecret" className="block text-sm font-medium text-gray-700 mb-2">
                  Zoho Client Secret
                </label>
                <Input
                  id="clientSecret"
                  name="clientSecret"
                  type="password"
                  value={zohoCredentials.clientSecret}
                  onChange={handleZohoInputChange}
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  placeholder="Enter Zoho Client Secret"
                />
              </div>
              
              <div>
                <label htmlFor="refreshToken" className="block text-sm font-medium text-gray-700 mb-2">
                  Zoho Refresh Token
                </label>
                <Input
                  id="refreshToken"
                  name="refreshToken"
                  value={zohoCredentials.refreshToken}
                  onChange={handleZohoInputChange}
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  placeholder="Enter Zoho Refresh Token"
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  onClick={connectToZohoBooks}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  disabled={uploading || !zohoCredentials.clientId || !zohoCredentials.clientSecret || !zohoCredentials.refreshToken}
                >
                  <Database className="mr-2 h-4 w-4" />
                  Connect to Zoho Books
                </Button>
              </div>
              
              <div className="rounded-md bg-yellow-50 p-4 mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        To connect to Zoho Books, you'll need to create a self-client application in the Zoho Developer Console.
                        Follow Zoho's documentation to obtain your Client ID, Client Secret, and Refresh Token.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClientsImport;
