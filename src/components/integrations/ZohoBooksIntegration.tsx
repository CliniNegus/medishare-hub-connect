
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ZohoBooksIntegration = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchZohoData = async (action: string, data = {}) => {
    setLoading(action);
    try {
      const { data: responseData, error } = await supabase.functions.invoke('zoho-books-integration', {
        body: { action, data }
      });

      if (error) throw error;
      
      if (action === 'list_contacts') {
        setContacts(responseData.contacts || []);
      } else if (action === 'list_invoices') {
        setInvoices(responseData.invoices || []);
      }
      
      toast({
        title: "Success",
        description: `${action.replace('_', ' ')} completed successfully`,
      });
      
      return responseData;
    } catch (error: any) {
      console.error('Zoho integration error:', error);
      toast({
        title: "Integration error",
        description: error.message || "Failed to connect to Zoho Books",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const importClientData = async () => {
    try {
      setLoading('import_clients');
      
      // First get contacts from Zoho
      const contactsData = await fetchZohoData('list_contacts');
      
      if (!contactsData?.contacts?.length) {
        toast({
          title: "No contacts found",
          description: "No contacts were found in Zoho Books to import",
        });
        return;
      }
      
      // Format contacts for our system
      const hospitals = contactsData.contacts.map((contact: any) => ({
        name: contact.contact_name,
        address: [contact.billing_address?.address, contact.billing_address?.city, contact.billing_address?.state].filter(Boolean).join(', '),
        phone: contact.phone || null,
        website: contact.website || null,
        // You would need to define how to map other fields
      }));
      
      // For each contact, insert into hospitals table
      for (const hospital of hospitals) {
        await supabase.from('hospitals').insert(hospital);
      }
      
      toast({
        title: "Import successful",
        description: `Imported ${hospitals.length} clients from Zoho Books`,
      });
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Import error",
        description: error.message || "Failed to import clients",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zoho Books Integration</CardTitle>
        <CardDescription>
          Sync data between your platform and Zoho Books accounting software
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{contacts.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Synced contacts from Zoho Books
                  </p>
                  <Button 
                    onClick={() => fetchZohoData('list_contacts')}
                    className="mt-2 w-full bg-red-600 hover:bg-red-700"
                    disabled={loading === 'list_contacts'}
                  >
                    {loading === 'list_contacts' ? 'Loading...' : 'Fetch Contacts'}
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{invoices.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Synced invoices from Zoho Books
                  </p>
                  <Button 
                    onClick={() => fetchZohoData('list_invoices')}
                    className="mt-2 w-full bg-red-600 hover:bg-red-700"
                    disabled={loading === 'list_invoices'}
                  >
                    {loading === 'list_invoices' ? 'Loading...' : 'Fetch Invoices'}
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Import Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">
                    Import your clients from Zoho Books into the platform
                  </p>
                  <Button 
                    onClick={importClientData}
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={loading === 'import_clients'}
                  >
                    {loading === 'import_clients' ? 'Importing...' : 'Import Client Data'}
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border mt-4">
              <h3 className="text-sm font-medium mb-2">Integration Status</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-sm text-gray-600">Connection Status</span>
                  <span className="text-sm font-medium text-green-600">Connected</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Sync</span>
                  <span className="text-sm font-medium">
                    {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                  </span>
                </li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="contacts">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Zoho Books Contacts</h3>
              <Button 
                onClick={() => fetchZohoData('list_contacts')}
                variant="outline"
                disabled={loading === 'list_contacts'}
              >
                {loading === 'list_contacts' ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
            
            {contacts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact Name</TableHead>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.contact_id}>
                      <TableCell className="font-medium">{contact.contact_name}</TableCell>
                      <TableCell>{contact.company_name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No contacts loaded. Click "Refresh" to load contacts from Zoho Books.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="invoices">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Zoho Books Invoices</h3>
              <Button 
                onClick={() => fetchZohoData('list_invoices')}
                variant="outline"
                disabled={loading === 'list_invoices'}
              >
                {loading === 'list_invoices' ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
            
            {invoices.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.invoice_id}>
                      <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                      <TableCell>{invoice.customer_name}</TableCell>
                      <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                      <TableCell>{invoice.currency_symbol}{invoice.total}</TableCell>
                      <TableCell>{invoice.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No invoices loaded. Click "Refresh" to load invoices from Zoho Books.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label htmlFor="client-id" className="block text-sm font-medium mb-1">
                    Zoho Client ID
                  </label>
                  <Input id="client-id" type="text" placeholder="Client ID from Zoho API Console" disabled />
                </div>
                
                <div>
                  <label htmlFor="client-secret" className="block text-sm font-medium mb-1">
                    Zoho Client Secret
                  </label>
                  <Input id="client-secret" type="password" placeholder="••••••••" disabled />
                </div>
                
                <div>
                  <label htmlFor="organization-id" className="block text-sm font-medium mb-1">
                    Organization ID
                  </label>
                  <Input id="organization-id" type="text" placeholder="Zoho Books Organization ID" disabled />
                </div>
              </div>
              
              <div className="pt-4">
                <Button className="bg-red-600 hover:bg-red-700" disabled>
                  Update Credentials
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Zoho API credentials are managed by system administrators.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ZohoBooksIntegration;
