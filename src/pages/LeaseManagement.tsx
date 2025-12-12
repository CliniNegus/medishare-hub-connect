
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Filter, Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import LeasesList from "@/components/leases/LeasesList";
import LeaseForm from "@/components/leases/LeaseForm";
import LeaseStats from "@/components/leases/LeaseStats";
import LeaseAnalytics from "@/components/leases/LeaseAnalytics";
import { useRealTimeLeases } from "@/hooks/use-real-time-leases";

const LeaseManagement = () => {
  const { user, hasRole, userRoles } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  
  const { leases, loading, refetch } = useRealTimeLeases(activeTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleCreateSuccess = () => {
    setShowForm(false);
    refetch();
    toast({
      title: "Success",
      description: "Lease created successfully",
    });
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshed",
      description: "Lease data has been refreshed",
    });
  };

  const filteredLeases = leases.filter(lease => 
    lease.equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lease.hospital?.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lease.investor?.organization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if user has permission to create leases
  const canCreateLease = hasRole('admin') || hasRole('hospital') || hasRole('investor');

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#333333]">Lease Management</h1>
          <p className="text-gray-600 mt-1">
            Manage equipment leases, track performance, and analyze portfolio
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {!showForm && canCreateLease && (
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-[#E02020] hover:bg-[#E02020]/90 text-white"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Lease
            </Button>
          )}
        </div>
      </div>

      {showForm ? (
        <Card className="mb-6 border-[#E02020]/20">
          <CardHeader className="bg-[#E02020]/5 border-b border-[#E02020]/20">
            <CardTitle className="text-[#333333]">Create New Lease</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <LeaseForm 
              onSuccess={handleCreateSuccess} 
              onCancel={() => setShowForm(false)}
              userRole={userRoles.primaryRole}
              userId={user?.id}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Analytics Section */}
          <LeaseAnalytics leases={leases} userRole={userRoles.primaryRole} />
          
          {/* Stats Section */}
          <LeaseStats leases={leases} userRole={userRoles.primaryRole} />
          
          {/* Search and Filter Section */}
          <div className="my-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search leases by equipment, hospital, or investor..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-[#E02020] focus:ring-[#E02020]"
              />
            </div>
            <Button variant="outline" size="icon" className="border-gray-300">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Leases Table with Tabs */}
          <Card className="border-[#E02020]/20">
            <CardHeader className="bg-[#E02020]/5 border-b border-[#E02020]/20">
              <CardTitle className="text-[#333333]">Lease Portfolio</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="active" onValueChange={handleTabChange}>
                <div className="border-b border-gray-200 px-6 pt-4">
                  <TabsList className="mb-4 bg-gray-100">
                    <TabsTrigger 
                      value="active" 
                      className="data-[state=active]:bg-[#E02020] data-[state=active]:text-white"
                    >
                      Active Leases ({leases.filter(l => l.status === 'active').length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="completed"
                      className="data-[state=active]:bg-[#E02020] data-[state=active]:text-white"
                    >
                      Completed ({leases.filter(l => l.status === 'completed').length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="canceled"
                      className="data-[state=active]:bg-[#E02020] data-[state=active]:text-white"
                    >
                      Canceled ({leases.filter(l => l.status === 'canceled').length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="all"
                      className="data-[state=active]:bg-[#E02020] data-[state=active]:text-white"
                    >
                      All Leases ({leases.length})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6">
                  <TabsContent value="active" className="mt-0">
                    <LeasesList 
                      leases={filteredLeases.filter(l => l.status === 'active')} 
                      loading={loading} 
                      onRefresh={refetch}
                      userRole={userRoles.primaryRole}
                    />
                  </TabsContent>
                  
                  <TabsContent value="completed" className="mt-0">
                    <LeasesList 
                      leases={filteredLeases.filter(l => l.status === 'completed')} 
                      loading={loading} 
                      onRefresh={refetch}
                      userRole={userRoles.primaryRole}
                    />
                  </TabsContent>
                  
                  <TabsContent value="canceled" className="mt-0">
                    <LeasesList 
                      leases={filteredLeases.filter(l => l.status === 'canceled')} 
                      loading={loading} 
                      onRefresh={refetch}
                      userRole={userRoles.primaryRole}
                    />
                  </TabsContent>
                  
                  <TabsContent value="all" className="mt-0">
                    <LeasesList 
                      leases={filteredLeases} 
                      loading={loading} 
                      onRefresh={refetch}
                      userRole={userRoles.primaryRole}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default LeaseManagement;
