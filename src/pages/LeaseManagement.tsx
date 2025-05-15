
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Filter, Search } from "lucide-react";
import LeasesList from "@/components/leases/LeasesList";
import LeaseForm from "@/components/leases/LeaseForm";
import LeaseStats from "@/components/leases/LeaseStats";
import { Input } from "@/components/ui/input";

const LeaseManagement = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [leases, setLeases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    fetchLeases();
  }, [user, activeTab]);

  const fetchLeases = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Filter leases based on user role and active tab
      let query = supabase
        .from('leases')
        .select(`
          *,
          equipment:equipment_id (name, category),
          hospital:hospital_id (organization, email),
          investor:investor_id (organization, email)
        `);

      // Apply status filter based on active tab
      if (activeTab === 'active') {
        query = query.eq('status', 'active');
      } else if (activeTab === 'completed') {
        query = query.eq('status', 'completed');
      } else if (activeTab === 'canceled') {
        query = query.eq('status', 'canceled');
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setLeases(data || []);
    } catch (error: any) {
      console.error('Error fetching leases:', error);
      toast({
        title: "Error fetching leases",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleCreateSuccess = () => {
    setShowForm(false);
    fetchLeases();
    toast({
      title: "Success",
      description: "Lease created successfully",
    });
  };

  const filteredLeases = leases.filter(lease => 
    lease.equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lease.hospital?.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lease.investor?.organization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lease Management</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Lease
          </Button>
        )}
      </div>

      {showForm ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Lease</CardTitle>
          </CardHeader>
          <CardContent>
            <LeaseForm 
              onSuccess={handleCreateSuccess} 
              onCancel={() => setShowForm(false)}
              userRole={profile?.role}
              userId={user?.id}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <LeaseStats leases={leases} userRole={profile?.role} />
          
          <div className="my-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search leases..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <Tabs defaultValue="active" onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active Leases</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="canceled">Canceled</TabsTrigger>
              <TabsTrigger value="all">All Leases</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <LeasesList 
                leases={filteredLeases} 
                loading={loading} 
                onRefresh={fetchLeases}
                userRole={profile?.role}
              />
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              <LeasesList 
                leases={filteredLeases} 
                loading={loading} 
                onRefresh={fetchLeases}
                userRole={profile?.role}
              />
            </TabsContent>
            
            <TabsContent value="canceled" className="space-y-4">
              <LeasesList 
                leases={filteredLeases} 
                loading={loading} 
                onRefresh={fetchLeases}
                userRole={profile?.role}
              />
            </TabsContent>
            
            <TabsContent value="all" className="space-y-4">
              <LeasesList 
                leases={filteredLeases} 
                loading={loading} 
                onRefresh={fetchLeases}
                userRole={profile?.role}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default LeaseManagement;
