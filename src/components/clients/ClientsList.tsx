import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ClientsImportModal from './import/ClientsImportModal';

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
}

const ClientsList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [importModalOpen, setImportModalOpen] = useState(false);
  
  useEffect(() => {
    fetchClients();
  }, [user]);

  const fetchClients = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('organization_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setClients(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching clients",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (client.phone && client.phone.includes(searchQuery))
  );

  return (
    <Card className="w-full border-red-600">
      <CardHeader>
        <CardTitle className="text-red-600">Clients</CardTitle>
        <CardDescription>Manage your client relationships</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search clients..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button onClick={() => setImportModalOpen(true)} className="flex-1 sm:flex-none">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="default" className="flex-1 sm:flex-none">
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </div>
        </div>

        <ClientsImportModal
          open={importModalOpen}
          onOpenChange={setImportModalOpen}
          onImportComplete={fetchClients}
        />

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading clients...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-12 border rounded-md">
            <h3 className="text-lg font-medium text-gray-900 mb-1">No clients found</h3>
            {searchQuery ? (
              <p className="text-sm text-gray-500 mb-4">No results match your search criteria.</p>
            ) : (
              <p className="text-sm text-gray-500 mb-4">Get started by adding your first client or importing from CSV.</p>
            )}
            {!searchQuery && (
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => setImportModalOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Clients
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Client
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email || '-'}</TableCell>
                    <TableCell>{client.phone || '-'}</TableCell>
                    <TableCell className="max-w-xs truncate">{client.address || '-'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">View</Button>
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
  );
};

export default ClientsList;
