
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { Search, Plus, Trash2, Edit3, ExternalLink } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  source: string | null;
  external_id: string | null;
  created_at: string;
}

const ClientsList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('organization_id', user?.id)
        .order('name', { ascending: true });

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

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
        .eq('organization_id', user?.id);

      if (error) throw error;

      setClients(clients.filter(client => client.id !== id));
      
      toast({
        title: "Client deleted",
        description: "The client has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting client",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (client.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full border-red-600">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-red-600">Clients</CardTitle>
            <CardDescription>View and manage your clients</CardDescription>
          </div>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search clients..."
              className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : filteredClients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{client.email || '-'}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{client.phone || '-'}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.source === 'csv' ? 'CSV Import' : 
                         client.source === 'zoho' ? 'Zoho Books' : 'Manual Entry'}
                        {client.source === 'zoho' && client.external_id && (
                          <ExternalLink className="inline-block ml-1 h-3 w-3 text-gray-400" />
                        )}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-500 hover:text-red-600"
                            onClick={() => deleteClient(client.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6">
              <h3 className="text-gray-500">No clients found</h3>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm ? "Try a different search term" : "Import or add clients to get started"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientsList;
